'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Collection = require('./Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Instance = require('./Instance.js');

var _Instance2 = _interopRequireDefault(_Instance);

var _builders = require('../helpers/builders');

var _optionsCache = require('../helpers/optionsCache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class Resource {
  constructor(type, api) {
    this.type = type;
    this.api = api;
    this.optionsCache = _optionsCache.optionsCache.bind(this);
    Object.freeze(this);
  }

  list(params) {
    return this.api.client.get(this.type, params).then(_processResponse2.default).then(_builders.buildCollectionWithResponse.bind(undefined, this));
  }

  emptyCollection() {
    return new _Collection2.default({}, this.api, this);
  }

  new(instanceData) {
    instanceData.type = this.type;
    return new _Instance2.default(instanceData, this.api);
  }

  relatedForId(id, name, params) {
    let parentInstance = this.new({ id });
    return this.api.client.get(`${ this.type }/${ id }/${ name }`, params).then(_processResponse2.default).then(response => (0, _builders.buildCollectionOrInstance)(parentInstance, name, response));
  }

  relationshipForId(id, name, params) {
    return this.api.client.get(`${ this.type }/${ id }/relationships/${ name }`, params).then(_processResponse2.default).then(_builders.buildOneOrManyRelationship.bind(undefined, this));
  }

  create(instanceData, params) {
    return this.new(instanceData).save(params);
  }

  read(id, params) {
    return new _Instance2.default({ type: this.type, id }, this.api).reload(params);
  }

  uri() {
    return this.type;
  }

  optionsCacheKey() {
    for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
      additions[_key] = arguments[_key];
    }

    return _path2.default.join(this.type, ...additions);
  }

  options() {
    return this.api.client.options(this.type).then(_processResponse2.default);
  }
};