'use strict';

const Instance = require('./instance.js');
const processResponse = require('../helpers/processResponse.js');

class Collection extends Array {
  constructor(_ref, api, defaultResource) {
    let data = _ref.data;
    let links = _ref.links;
    let meta = _ref.meta;

    super();

    this.api = api;
    this.defaultResource = defaultResource;

    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    (data || []).forEach(function (instanceData) {
      this.push(new Instance(instanceData, api, this));
    }, this);

    Object.freeze(this);
  }

  first() {
    return this[0];
  }

  last() {
    return this[this.length - 1];
  }

  new(_ref2) {
    let type = _ref2.type;
    let attributes = _ref2.attributes;
    let id = _ref2.id;

    type = type || this.defaultResource.type;
    return new Instance({
      type,
      attributes,
      id
    }, this.api, this);
  }

  create(instanceData, params) {
    return this.new(instanceData).save(params);
  }

  deleteAll(params) {
    var api = this.api;
    var links = this.links;
    var meta = this.meta;
    var defaultResource = this.defaultResource;

    return Promise.all(this.map(function (instance) {
      return instance.delete(params);
    })).then(function (responses) {
      var collection = new Collection({
        data: [],
        links,
        meta
      }, api, defaultResource);
      return {
        responses,
        collection
      };
    });
  }

  options(params) {
    return this.api.client.options(this.uri(), params).then(processResponse);
  }

  reload(params) {
    var _require = require('../helpers/builders');

    var buildCollectionWithResponse = _require.buildCollectionWithResponse;

    return this.api.client.get(this.uri(), params).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  nextPage() {
    var _require2 = require('../helpers/builders');

    var buildCollectionWithResponse = _require2.buildCollectionWithResponse;

    return this.api.client.get(this.links['next']).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  prevPage() {
    var _require3 = require('../helpers/builders');

    var buildCollectionWithResponse = _require3.buildCollectionWithResponse;

    return this.api.client.get(this.links['prev']).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  firstPage() {
    var _require4 = require('../helpers/builders');

    var buildCollectionWithResponse = _require4.buildCollectionWithResponse;

    return this.api.client.get(this.links['first']).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  lastPage() {
    var _require5 = require('../helpers/builders');

    var buildCollectionWithResponse = _require5.buildCollectionWithResponse;

    return this.api.client.get(this.links['last']).then(processResponse).then(buildCollectionWithResponse.bind(undefined, this));
  }

  uri() {
    return this.links.self || this.defaultResource.type;
  }
}

module.exports = Collection;