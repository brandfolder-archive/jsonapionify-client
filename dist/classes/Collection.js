'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Instance = require('./Instance.js');

var _Instance2 = _interopRequireDefault(_Instance);

var _optionsCache = require('../helpers/optionsCache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Collection extends Array {
  constructor(_ref, api, defaultResource) {
    let data = _ref.data;
    let links = _ref.links;
    let meta = _ref.meta;

    super();

    this.api = api;
    this.defaultResource = defaultResource;
    this.optionsCache = _optionsCache.optionsCache.bind(this);

    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    (data || []).forEach(function (instanceData) {
      this.push(new _Instance2.default(instanceData, api, this));
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

  new(_ref2) {
    let type = _ref2.type;
    let attributes = _ref2.attributes;
    let id = _ref2.id;

    type = type || this.defaultResource.type;
    return new _Instance2.default({
      type,
      attributes,
      id
    }, this.api, this);
  }

  create(instanceData, params) {
    return this.new(instanceData).save(params);
  }

  deleteAll(params) {
    let api = this.api;
    let links = this.links;
    let meta = this.meta;
    let defaultResource = this.defaultResource;

    return Promise.all(this.map(function (instance) {
      return instance.delete(params);
    })).then(function (responses) {
      let collection = new Collection({
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

  optionsCacheKey() {
    for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
      additions[_key] = arguments[_key];
    }

    if (this.defaultResource) {
      return this.defaultResource.optionsCacheKey(...additions);
    }
    return _path2.default.join(this.uri(), ...additions);
  }

  options(params) {
    return (0, _optionsCache.optionsCache)(() => this.api.client.options(this.uri(), params).then(_processResponse2.default));
  }

  reload(params) {
    var _require = require('../helpers/builders');

    let buildCollectionWithResponse = _require.buildCollectionWithResponse;

    return this.api.client.get(this.uri(), params).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
  }

  nextPage() {
    var _require2 = require('../helpers/builders');

    let buildCollectionWithResponse = _require2.buildCollectionWithResponse;

    return this.api.client.get(this.links['next']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
  }

  prevPage() {
    var _require3 = require('../helpers/builders');

    let buildCollectionWithResponse = _require3.buildCollectionWithResponse;

    return this.api.client.get(this.links['prev']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
  }

  firstPage() {
    var _require4 = require('../helpers/builders');

    let buildCollectionWithResponse = _require4.buildCollectionWithResponse;

    return this.api.client.get(this.links['first']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
  }

  lastPage() {
    var _require5 = require('../helpers/builders');

    let buildCollectionWithResponse = _require5.buildCollectionWithResponse;

    return this.api.client.get(this.links['last']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
  }

  uri() {
    let params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    let u = _url2.default.parse(this.links.self || this.defaultResource.type);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }
}

module.exports = Collection;