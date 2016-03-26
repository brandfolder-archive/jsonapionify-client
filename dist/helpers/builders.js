'use strict';

var _require = require('./collectionModifiers');

const collectionWithInstance = _require.collectionWithInstance;
const collectionWithoutInstance = _require.collectionWithoutInstance;


function buildCollectionOrInstance(instance, relName, response) {
  let api = instance.api;
  let links = instance.links;
  let json = response.json;

  // Return the collection, we need to fetch the options to determine the
  // resource type

  if (json.data instanceof Array) {
    return buildRelatedCollectionWithResponse(instance, relName, response);
  } else if (json.data instanceof Object) {
    return buildInstanceWithResponse({ api }, response);
  } else if (json.data === null) {
    return buildEmptyInstanceWithResponse({ api, links }, response);
  }
}

function buildOneOrManyRelationship(_ref, response) {
  let api = _ref.api;

  let ManyRelationship = require('../classes/ManyRelationship.js');
  let OneRelationship = require('../classes/OneRelationship.js');
  let relationship;

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

function buildEmptyInstanceWithResponse(_ref2, response) {
  let api = _ref2.api;
  let links = _ref2.links;

  let Instance = require('../classes/Instance.js');
  return api.client.options(links.self).then(function (_ref3) {
    let optionsJson = _ref3.json;

    return new Instance({
      type: optionsJson.meta.type,
      links: {
        self: response.json.links.self
      }
    }, api);
  });
}

function buildDeletedInstanceWithResponse(_ref4, response) {
  let collection = _ref4.collection;
  let type = _ref4.type;
  let attributes = _ref4.attributes;
  let api = _ref4.api;

  let Instance = require('../classes/Instance.js');
  let instance = new Instance({
    type,
    attributes
  }, api);
  let newCollection = collectionWithoutInstance(collection, instance);
  return {
    instance,
    collection: newCollection,
    response
  };
}

function buildInstanceWithResponse(_ref5, _ref6) {
  let collection = _ref5.collection;
  let api = _ref5.api;
  let json = _ref6.json;
  let response = _ref6.response;

  let Instance = require('../classes/Instance.js');
  let instance = new Instance(json.data, api);
  let newCollection = collectionWithInstance(collection, instance);
  return {
    instance,
    response,
    collection: newCollection
  };
}

function buildRelatedCollectionWithResponse(parent, relName, responseObj) {
  let json = responseObj.json;
  let response = responseObj.response;

  let RelatedCollection = require('../classes/RelatedCollection.js');
  return parent.relatedOptions(relName).then(function (_ref7) {
    let optsJson = _ref7.json;

    let defResource = parent.api.resource(optsJson.meta.type);
    let collection = new RelatedCollection(json, parent, relName, defResource);
    return {
      collection,
      response
    };
  });
}

function buildCollectionWithResponse(_ref8, _ref9) {
  let api = _ref8.api;
  let type = _ref8.type;
  let json = _ref9.json;
  let response = _ref9.response;

  let collection;
  let uri = response.url;
  let Collection = require('../classes/Collection.js');
  if (type) {
    collection = new Collection(json, api, type);
    return {
      collection,
      response
    };
  }
  return api.client.options(uri).then(function (_ref10) {
    let optionsJson = _ref10.json;

    let defaultResource = api.resource(optionsJson.meta.type);
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

  let Instance = require('../classes/Instance.js');
  let instance = new Instance({
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