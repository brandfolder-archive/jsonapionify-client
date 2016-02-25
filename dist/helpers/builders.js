'use strict';

var _require = require('./collectionModifiers');

const collectionWithInstance = _require.collectionWithInstance;
const collectionWithoutInstance = _require.collectionWithoutInstance;


function buildCollectionOrInstance(instance, _ref) {
  let response = _ref.response;
  let json = _ref.json;
  var api = instance.api;
  var links = instance.links;

  // Return the collection, we need to fetch the options to determine the
  // resource type

  if (json.data instanceof Array) {
    return buildCollectionWithResponse({
      api
    }, {
      response,
      json
    });
  } else if (json.data instanceof Object) {
    return buildInstanceWithResponse({
      api
    }, {
      response,
      json
    });
  } else if (json.data === null) {
    return buildEmptyInstanceWithResponse({
      api,
      links
    }, {
      response,
      json
    });
  }
}

function buildOneOrManyRelationship(_ref2, response) {
  let api = _ref2.api;

  var ManyRelationship = require('../classes/ManyRelationship.js');
  var OneRelationship = require('../classes/OneRelationship.js');
  var relationship;

  if (response.json.data instanceof Array) {
    relationship = new ManyRelationship({
      api
    }, response.json);
  } else {
    relationship = new OneRelationship({
      api
    }, response.json);
  }

  return {
    relationship,
    response
  };
}

function buildEmptyInstanceWithResponse(_ref3, response) {
  let api = _ref3.api;
  let links = _ref3.links;

  var Instance = require('../classes/Instance.js');
  return api.client.options(links.self).then(function (_ref4) {
    let optionsJson = _ref4.json;

    return new Instance({
      type: optionsJson.meta.type,
      links: {
        self: response.json.links.self
      }
    }, api);
  });
}

function buildDeletedInstanceWithResponse(_ref5, response) {
  let collection = _ref5.collection;
  let type = _ref5.type;
  let attributes = _ref5.attributes;
  let api = _ref5.api;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type,
    attributes
  }, api);
  var newCollection = collectionWithoutInstance(collection, instance);
  return {
    instance,
    collection: newCollection,
    response
  };
}

function buildInstanceWithResponse(_ref6, _ref7) {
  let collection = _ref6.collection;
  let api = _ref6.api;
  let json = _ref7.json;
  let response = _ref7.response;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance(json.data, api);
  var newCollection = collectionWithInstance(collection, instance);
  return {
    instance,
    response,
    collection: newCollection
  };
}

function buildCollectionWithResponse(_ref8, _ref9) {
  let api = _ref8.api;
  let type = _ref8.type;
  let json = _ref9.json;
  let response = _ref9.response;

  var collection;
  var uri = response.url;
  var Collection = require('../classes/Collection.js');
  if (type) {
    collection = new Collection(json, api, type);
    return {
      collection,
      response
    };
  }
  return api.client.options(uri).then(function (_ref10) {
    let optionsJson = _ref10.json;

    var defaultResource = api.resource(optionsJson().meta.type);
    collection = new Collection(json, api, defaultResource);
    return {
      collection,
      response
    };
  });
}

function buildInstanceWithAttributes(_ref11, attributes) {
  let type = _ref11.type;
  let id = _ref11.id;
  let relationships = _ref11.relationships;
  let links = _ref11.links;
  let meta = _ref11.meta;
  let api = _ref11.api;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type,
    id,
    links,
    meta,
    relationships,
    attributes
  }, api);
  return Promise.resolve({
    instance,
    attributes
  });
}

module.exports = {
  buildCollectionOrInstance,
  buildOneOrManyRelationship,
  buildInstanceWithAttributes,
  buildDeletedInstanceWithResponse,
  buildInstanceWithResponse,
  buildCollectionWithResponse
};