const Instance = require('./Instance.js');
const processResponse = require('../helpers/processResponse.js');
const url = require('url');
const { optionsCache } = require('../helpers/optionsCache');
const path = require('path');

class Collection extends Array {
  constructor({ data, links, meta }, api, defaultResource) {
    super();

    this.api = api;
    this.defaultResource = defaultResource;
    this.optionsCache = optionsCache.bind(this);

    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    (data || []).forEach(function (instanceData) {
      this.push(new Instance(instanceData, api, this));
    }, this);

    if (this.constructor === Collection) {
      Object.freeze(this);
    }
  }

  first() {
    return this[0];
  }

  last() {
    return this[this.length - 1];
  }

  new({ type, attributes, id }) {
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
    var { api, links, meta, defaultResource } = this;
    return Promise.all(
      this.map(function (instance) {
        return instance.delete(params);
      })
    ).then(function (responses) {
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

  optionsCacheKey(...additions) {
    if (this.defaultResource) {
      return this.defaultResource.optionsCacheKey(...additions);
    }
    return path.join(this.uri(), ...additions);
  }

  options(params) {
    return optionsCache(
      () => this.api.client.options(this.uri(), params).then(processResponse)
    );
  }

  reload(params) {
    var { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.uri(), params).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  nextPage() {
    var { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['next']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  prevPage() {
    var { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['prev']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  firstPage() {
    var { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['first']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  lastPage() {
    var { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['last']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  uri(params = false) {
    var u = url.parse(this.links.self || this.defaultResource.type);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }
}

module.exports = Collection;
