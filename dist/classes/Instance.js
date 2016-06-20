'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier = require('./ResourceIdentifier');

var _ResourceIdentifier2 = _interopRequireDefault(_ResourceIdentifier);

var _errors = require('../errors');

var _instanceActions = require('../helpers/instanceActions');

var _optionsCache = require('../helpers/optionsCache');

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Instance extends _ResourceIdentifier2.default {
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
    this.optionsCache = _optionsCache.optionsCache.bind(this);
    this.attributes = Object.freeze(attributes || {});
    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    this.relationships = Object.freeze(relationships);

    Object.freeze(this);
  }

  // Checks whether or not the instance is persisted using a very
  // small response body
  checkPersistence() {
    let instance = this;
    let params = { fields: {} };
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
    return this.checkPersistence().then(_instanceActions.deleteInstance.bind(undefined, this, params));
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

    return _path2.default.join(parentKey, idKey, ...additions);
  }

  // Returns the request options
  options() {
    return this.optionsCache(() => {
      setTimeout(() => delete this.optionsCache[this.optionsCacheKey()], 120);
      return this.api.client.options(this.uri()).then(_processResponse2.default);
    });
  }

  // Fetches the related collection or instance
  related(name, params) {
    var _require = require('../helpers/builders');

    const buildCollectionOrInstance = _require.buildCollectionOrInstance;

    return (0, _preparers.getRelationshipData)(this, name).then(function (_ref2) {
      let data = _ref2.data;
      let api = _ref2.api;

      return api.client.get(data.links.related, params);
    }).then(_processResponse2.default).then(response => buildCollectionOrInstance(this, name, response));
  }

  // Gets options about the relation
  relatedOptions(name) {
    return this.optionsCache(() => {
      return (0, _preparers.getRelationshipData)(this, name).then(function (_ref3) {
        let data = _ref3.data;
        let api = _ref3.api;

        return api.client.options(data.links.related);
      }).then(_processResponse2.default);
    }, name);
  }

  // Fetches the relationship
  relationship(name, params) {
    var _require2 = require('../helpers/builders');

    const buildOneOrManyRelationship = _require2.buildOneOrManyRelationship;

    return (0, _preparers.getRelationshipData)(this, name).then(function (_ref4) {
      let data = _ref4.data;
      let api = _ref4.api;

      return api.client.get(data.links.self, params);
    }).then(_processResponse2.default).then(buildOneOrManyRelationship.bind(undefined, this));
  }

  // Reloads the instance, returns a new instance object with the reloaded data
  reload(params) {
    return (0, _instanceActions.reloadInstance)(this, params);
  }

  // Saves the instance, returns a new object with the saved data.
  save(params) {
    let instance = this;
    return this.checkPersistence().then(function () {
      return (0, _instanceActions.patchInstance)(instance, params);
    }).catch(function (error) {
      // Create the instance
      if (error instanceof _errors.NotPersistedError) {
        return (0, _instanceActions.postInstance)(instance, params);
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

    let selfUri = this.links.self;
    let parentUri = this.collection && this.collection.uri(false);
    let resourceUri = _lodash2.default.compact([this.type, this.id]).join('/');
    let u = _url2.default.parse(selfUri || parentUri || resourceUri);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }

  // Writes the new attributes, returns an instance with the newly written
  // attributes
  writeAttributes(attributes) {
    var _require3 = require('../helpers/builders');

    const buildInstanceWithAttributes = _require3.buildInstanceWithAttributes;

    let newAttributes = {};
    let keys = Object.keys(this.attributes).concat(Object.keys(attributes));
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