'use strict';

const processResponse = require('../helpers/processResponse.js');
const Instance = require('./Instance.js');
const Collection = require('./Collection.js');

var _require = require('../helpers/optionsCache');

const optionsCache = _require.optionsCache;

const path = require('path');

var _require2 = require('../helpers/builders');

const buildOneOrManyRelationship = _require2.buildOneOrManyRelationship;
const buildCollectionOrInstance = _require2.buildCollectionOrInstance;
const buildCollectionWithResponse = _require2.buildCollectionWithResponse;


module.exports = class Resource {
  constructor(type, api) {
    this.type = type;
    this.api = api;
    this.optionsCache = optionsCache.bind(this);
    Object.freeze(this);
  }

  list(params) {
    return this.api.client.get(this.type, params).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  emptyCollection() {
    return new Collection({}, this.api, this);
  }

  new(instanceData) {
    instanceData.type = this.type;
    return new Instance(instanceData, this.api);
  }

  relatedForId(id, name, params) {
    let parentInstance = this.new({ id });
    return this.api.client.get(`${ this.type }/${ id }/${ name }`, params).then(processResponse).then(response => buildCollectionOrInstance(parentInstance, name, response));
  }

  relationshipForId(id, name, params) {
    return this.api.client.get(`${ this.type }/${ id }/relationships/${ name }`, params).then(processResponse).then(buildOneOrManyRelationship.bind(undefined, this));
  }

  create(instanceData, params) {
    return this.new(instanceData).save(params);
  }

  read(id, params) {
    return new Instance({ type: this.type, id }, this.api).reload(params);
  }

  uri() {
    return this.type;
  }

  optionsCacheKey() {
    for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
      additions[_key] = arguments[_key];
    }

    return path.join(this.type, ...additions);
  }

  options() {
    return this.api.client.options(this.type).then(processResponse);
  }
};