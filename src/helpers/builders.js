const {
  collectionWithInstance, collectionWithoutInstance
} = require('./collectionModifiers');

function buildCollectionOrInstance(instance, { response, json }) {
  var { api, links } = instance;

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

function buildOneOrManyRelationship({ api }, response) {
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

function buildEmptyInstanceWithResponse({ api, links }, response) {
  var Instance = require('../classes/Instance.js');
  return api.client.options(links.self).then(function ({ json: optionsJson }) {
    return new Instance({
      type: optionsJson.meta.type,
      links: {
        self: response.json.links.self
      }
    }, api);
  });
}

function buildDeletedInstanceWithResponse({
  collection, type, attributes, api } , response
) {
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

function buildInstanceWithResponse({ collection, api } , { json, response }) {
  var Instance = require('../classes/Instance.js');
  var instance = new Instance(json.data, api);
  var newCollection = collectionWithInstance(collection, instance);
  return {
    instance,
    response,
    collection: newCollection
  };
}

function buildCollectionWithResponse({ api, type } , { json, response }) {
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
  return api.client.options(uri).then(function ({ json: optionsJson }) {
    var defaultResource = api.resource(optionsJson.meta.type);
    collection = new Collection(json, api, defaultResource);
    return {
      collection,
      response
    };
  });
}

function buildInstanceWithAttributes(
  { type, id, relationships, links, meta, api } , attributes
) {
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
