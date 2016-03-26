const {
  collectionWithInstance, collectionWithoutInstance
} = require('./collectionModifiers');

function buildCollectionOrInstance(instance, relName, response) {
  let { api, links } = instance;
  let { json } = response;

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

function buildOneOrManyRelationship({ api }, response) {
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

function buildEmptyInstanceWithResponse({ api, links }, response) {
  let Instance = require('../classes/Instance.js');
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

function buildInstanceWithResponse({ collection, api } , { json, response }) {
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
  let { json, response } = responseObj;
  let RelatedCollection = require('../classes/RelatedCollection.js');
  return parent.relatedOptions(relName).then(function ({ json: optsJson }) {
    let defResource = parent.api.resource(optsJson.meta.type);
    let collection = new RelatedCollection(json, parent, relName, defResource);
    return {
      collection,
      response
    };
  });
}

function buildCollectionWithResponse({ api, type } , { json, response }) {
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
  return api.client.options(uri).then(function ({ json: optionsJson }) {
    let defaultResource = api.resource(optionsJson.meta.type);
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
