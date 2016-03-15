'use strict';

const ResourceIdentifier = require('./ResourceIdentifier');
const processResponse = require('../helpers/processResponse');

var _require = require('../helpers/preparers');

const getRelationshipData = _require.getRelationshipData;

var _require2 = require('../errors');

const NotPersistedError = _require2.NotPersistedError;

var _require3 = require('../helpers/optionsCache');

const optionsCache = _require3.optionsCache;

const url = require('url');
const _ = require('lodash');
const path = require('path');

var _require4 = require('../helpers/instanceActions');

const reloadInstance = _require4.reloadInstance;
const patchInstance = _require4.patchInstance;
const postInstance = _require4.postInstance;
const deleteInstance = _require4.deleteInstance;


class Instance extends ResourceIdentifier {
  constructor(_ref, api, collection) {
    let type = _ref.type;
    let id = _ref.id;
    let attributes = _ref.attributes;
    let links = _ref.links;
    let meta = _ref.meta;
    let relationships = _ref.relationships;

    super({
      type,
      id
    });
    this.api = api;
    this.collection = collection;
    this.optionsCache = optionsCache.bind(this);
    this.attributes = Object.freeze(attributes || {});
    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    this.relationships = Object.freeze(relationships);

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

  get peristed() {
    return Boolean(this.links.self);
  }

  // Deletes an instance, returning a new instance with the same attributes, but
  // with no ID. The instance can be recreated by calling save() on the instance
  delete(params) {
    return this.checkPersistence().then(deleteInstance.bind(undefined, this, params));
  }

  get resource() {
    return this.api.resource(this.type);
  }

  optionsCacheKey() {
    let parentKey;
    let idKey = this.persisted && this.id ? ':id' : 'new';
    if (this.collection && !this.id) {
      parentKey = this.collection.optionsCacheKey();
    } else {
      parentKey = this.resource.optionsCacheKey();
    }

    for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
      additions[_key] = arguments[_key];
    }

    return path.join(parentKey, idKey, ...additions);
  }

  // Returns the request options
  options() {
    return this.optionsCache(() => {
      setTimeout(() => delete this.optionsCache[this.optionsCacheKey()], 120);
      return this.api.client.options(this.uri()).then(processResponse);
    });
  }

  // Fetches the related collection or instance
  related(name, params) {
    var _require5 = require('../helpers/builders');

    const buildCollectionOrInstance = _require5.buildCollectionOrInstance;

    return getRelationshipData(this, name).then(function (_ref2) {
      let data = _ref2.data;
      let api = _ref2.api;

      return api.client.get(data.links.related, params);
    }).then(processResponse).then(response => buildCollectionOrInstance(this, name, response));
  }

  // Gets options about the relation
  relatedOptions(name) {
    return this.optionsCache(() => {
      return getRelationshipData(this, name).then(function (_ref3) {
        let data = _ref3.data;
        let api = _ref3.api;

        return api.client.options(data.links.related);
      }).then(processResponse);
    }, name);
  }

  // Fetches the relationship
  relationship(name, params) {
    var _require6 = require('../helpers/builders');

    const buildOneOrManyRelationship = _require6.buildOneOrManyRelationship;

    return getRelationshipData(this, name).then(function (_ref4) {
      let data = _ref4.data;
      let api = _ref4.api;

      return api.client.get(data.links.self, params);
    }).then(processResponse).then(buildOneOrManyRelationship.bind(undefined, this));
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
    }).catch(function (error) {
      // Create the instance
      if (error instanceof NotPersistedError) {
        return postInstance(instance, params);
      }
      throw error;
    });
  }

  // Updates and returns a new instance object with the updated attributes
  updateAttributes(attributes, params) {
    return this.writeAttributes(attributes).then(function (_ref5) {
      let instance = _ref5.instance;

      return instance.save(params);
    });
  }

  uri() {
    let params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var selfUri = this.links.self;
    var parentUri = this.collection && this.collection.uri(false);
    var resourceUri = _.compact([this.type, this.id]).join('/');
    var u = url.parse(selfUri || parentUri || resourceUri);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }

  // Writes the new attributes, returns an instance with the newly written
  // attributes
  writeAttributes(attributes) {
    var _require7 = require('../helpers/builders');

    const buildInstanceWithAttributes = _require7.buildInstanceWithAttributes;

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