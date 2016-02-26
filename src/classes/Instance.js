const ResourceIdentifier = require('./ResourceIdentifier');
const processResponse = require('../helpers/processResponse');
const { getRelationshipData } = require('../helpers/preparers');
const { NotPersistedError } = require('../errors');
const {
  reloadInstance, patchInstance, postInstance, deleteInstance
} = require('../helpers/instanceActions');

class Instance extends ResourceIdentifier {
  constructor(
    { type, id, attributes, links, meta, relationships } , api, collection
  ) {
    super({
      type,
      id
    });
    this.api = api;
    this.collection = collection;
    this.attributes = Object.freeze(attributes || {});
    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    this.relationships = Object.freeze(relationships);

    this.persisted = Boolean(this.links.self);

    Object.freeze(this);
  }

  // Checks whether or not the instance is persisted using a very
  // small response body
  checkPersistence() {
    var instance = this;
    var params = {
      fields: {},
      'include-relationships': false
    };
    params.fields[this.type] = null;
    if (this.persisted) {
      return Promise.resolve(instance);
    }
    return this.reload(params).then(function () {
      return instance;
    });
  }

  // Deletes an instance, returning a new instance with the same attributes, but
  // with no ID. The instance can be recreated by calling save() on the instance
  delete(params) {
    return this.checkPersistence().then(
      deleteInstance.bind(undefined, this, params)
    );
  }

  // Returns the request options
  options() {
    return this.api.client.options(this.uri()).then(
      processResponse
    );
  }

  // Fetches the related collection or instance
  related(name, params) {
    const { buildCollectionOrInstance } = require('../helpers/builders');
    return getRelationshipData(this, name).then(function ({ data, api }) {
      return api.client.get(data.links.related, params);
    }).then(
      processResponse
    ).then(
      buildCollectionOrInstance.bind(undefined, this)
    );
  }

  // Gets options about the relation
  relatedOptions(name, params) {
    return getRelationshipData(this, name).then(function ({ data, api }) {
      return api.client.options(data.links.related, params);
    }).then(
      processResponse
    );
  }

  // Fetches the relationship
  relationship(name, params) {
    const { buildOneOrManyRelationship } = require('../helpers/builders');
    return getRelationshipData(this, name).then(function ({ data, api }) {
      return api.client.get(data.links.self, params);
    }).then(
      processResponse
    ).then(
      buildOneOrManyRelationship.bind(undefined, this)
    );
  }

  // Reloads the instance, returns a new instance object with the reloaded data
  reload(params) {
    return reloadInstance(this, params);
  }

  // Saves the instance, returns a new object with the saved data.
  save(params) {
    var instance = this;
    return this.checkPersistence().then(function () {
      return patchInstance(instance, params);
    }).catch(function (error) { // Create the instance
      if (error instanceof NotPersistedError) {
        return postInstance(instance, params);
      }
      throw error;
    });
  }

  // Updates and returns a new instance object with the updated attributes
  updateAttributes(attributes, params) {
    return this.writeAttributes(attributes).then(function ({ instance }) {
      return instance.save(params);
    });
  }

  uri() {
    var collectionUri = this.collection ? this.collection.uri() : undefined;
    return this.links.self ||
      collectionUri ||
      [ this.type, this.id ].filter(function (i) {
        return i !== undefined;
      }).join('/');
  }
  // Writes the new attributes, returns an instance with the newly written
  // attributes
  writeAttributes(attributes) {
    const { buildInstanceWithAttributes } = require('../helpers/builders');
    var newAttributes = {};
    var keys = Object.keys(this.attributes).concat(Object.keys(attributes));
    keys.forEach(function (key) {
      if (attributes[key] !== undefined) {
        newAttributes[key] = attributes[key];
      } else {
        newAttributes[key] = this.attributes[key];
      }
    }, this);
    return buildInstanceWithAttributes(this, newAttributes);
  }
}

module.exports = Instance;
