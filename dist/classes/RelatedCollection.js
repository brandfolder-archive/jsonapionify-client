'use strict';

const Collection = require('./Collection.js');
const processResponse = require('../helpers/processResponse.js');
const url = require('url');

class RelatedCollection extends Collection {
  constructor(_ref, parent, relName, defaultResource) {
    let data = _ref.data;
    let links = _ref.links;
    let meta = _ref.meta;
    let api = parent.api;

    super({ data, links, meta }, api, defaultResource);
    this.parent = parent;
    this.relationshipName = relName;
    if (this.constructor === RelatedCollection) {
      Object.freeze(this);
    }
  }

  optionsCacheKey() {
    for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
      additions[_key] = arguments[_key];
    }

    return this.parent.optionsCacheKey(this.relationshipName, ...additions);
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
    let params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var u = url.parse(this.links.self || this.defaultResource.type);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }
}

module.exports = RelatedCollection;