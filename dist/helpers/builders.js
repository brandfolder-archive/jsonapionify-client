'use strict';

var _require = require('./collectionModifiers');

var collectionWithInstance = _require.collectionWithInstance;
var collectionWithoutInstance = _require.collectionWithoutInstance;


function buildCollectionOrInstance(instance, relName, response) {
  var api = instance.api;
  var links = instance.links;
  var json = response.json;

  // Return the collection, we need to fetch the options to determine the
  // resource type

  if (json.data instanceof Array) {
    return buildRelatedCollectionWithResponse(instance, relName, response);
  } else if (json.data instanceof Object) {
    return buildInstanceWithResponse({ api: api }, response);
  } else if (json.data === null) {
    return buildEmptyInstanceWithResponse({ api: api, links: links }, response);
  }
}

function buildOneOrManyRelationship(_ref, response) {
  var api = _ref.api;

  var ManyRelationship = require('../classes/ManyRelationship.js');
  var OneRelationship = require('../classes/OneRelationship.js');
  var relationship = void 0;

  if (response.json.data instanceof Array) {
    relationship = new ManyRelationship({
      api: api
    }, response.json);
  } else {
    relationship = new OneRelationship({
      api: api
    }, response.json);
  }

  return {
    relationship: relationship,
    response: response
  };
}

function buildEmptyInstanceWithResponse(_ref2, response) {
  var api = _ref2.api;
  var links = _ref2.links;

  var Instance = require('../classes/Instance.js');
  return api.client.options(links.self).then(function (_ref3) {
    var optionsJson = _ref3.json;

    return new Instance({
      type: optionsJson.meta.type,
      links: {
        self: response.json.links.self
      }
    }, api);
  });
}

function buildDeletedInstanceWithResponse(_ref4, response) {
  var collection = _ref4.collection;
  var type = _ref4.type;
  var attributes = _ref4.attributes;
  var api = _ref4.api;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type: type,
    attributes: attributes
  }, api);
  var newCollection = collectionWithoutInstance(collection, instance);
  return {
    instance: instance,
    collection: newCollection,
    response: response
  };
}

function buildInstanceWithResponse(_ref5, _ref6) {
  var collection = _ref5.collection;
  var api = _ref5.api;
  var json = _ref6.json;
  var response = _ref6.response;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance(json.data, api);
  var newCollection = collectionWithInstance(collection, instance);
  return {
    instance: instance,
    response: response,
    collection: newCollection
  };
}

function buildRelatedCollectionWithResponse(parent, relName, responseObj) {
  var json = responseObj.json;
  var response = responseObj.response;

  var RelatedCollection = require('../classes/RelatedCollection.js');
  return parent.relatedOptions(relName).then(function (_ref7) {
    var optsJson = _ref7.json;

    var defResource = parent.api.resource(optsJson.meta.type);
    var collection = new RelatedCollection(json, parent, relName, defResource);
    return {
      collection: collection,
      response: response
    };
  });
}

function buildCollectionWithResponse(_ref8, _ref9) {
  var api = _ref8.api;
  var type = _ref8.type;
  var json = _ref9.json;
  var response = _ref9.response;

  var collection = void 0;
  var uri = response.url;
  var Collection = require('../classes/Collection.js');
  if (type) {
    collection = new Collection(json, api, type);
    return {
      collection: collection,
      response: response
    };
  }
  return api.client.options(uri).then(function (_ref10) {
    var optionsJson = _ref10.json;

    var defaultResource = api.resource(optionsJson.meta.type);
    collection = new Collection(json, api, defaultResource);
    return {
      collection: collection,
      response: response
    };
  });
}

function buildInstanceWithAttributes(_ref11, attributes) {
  var type = _ref11.type;
  var id = _ref11.id;
  var relationships = _ref11.relationships;
  var links = _ref11.links;
  var meta = _ref11.meta;
  var api = _ref11.api;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type: type,
    id: id,
    links: links,
    meta: meta,
    relationships: relationships,
    attributes: attributes
  }, api);
  return Promise.resolve({
    instance: instance,
    attributes: attributes
  });
}

module.exports = {
  buildCollectionOrInstance: buildCollectionOrInstance,
  buildOneOrManyRelationship: buildOneOrManyRelationship,
  buildInstanceWithAttributes: buildInstanceWithAttributes,
  buildDeletedInstanceWithResponse: buildDeletedInstanceWithResponse,
  buildInstanceWithResponse: buildInstanceWithResponse,
  buildCollectionWithResponse: buildCollectionWithResponse
};