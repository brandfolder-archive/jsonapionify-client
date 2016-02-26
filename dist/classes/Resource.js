'use strict';

const processResponse = require('../helpers/processResponse.js');
const Instance = require('./Instance.js');
const Collection = require('./Collection.js');

var _require = require('../helpers/builders');

const buildOneOrManyRelationship = _require.buildOneOrManyRelationship;
const buildCollectionOrInstance = _require.buildCollectionOrInstance;
const buildCollectionWithResponse = _require.buildCollectionWithResponse;


module.exports = class Resource {
  constructor(type, api) {
    this.type = type;
    this.api = api;
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
    return this.api.client.get(`${ this.type }/${ id }/${ name }`, params).then(processResponse).then(buildCollectionOrInstance.bind(undefined, this));
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

  options() {
    return this.api.client.options(this.type).then(processResponse);
  }
};