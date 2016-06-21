'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Collection = require('./Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Instance = require('./Instance.js');

var _Instance2 = _interopRequireDefault(_Instance);

var _RelatedProxy = require('./RelatedProxy');

var _RelatedProxy2 = _interopRequireDefault(_RelatedProxy);

var _RelationshipProxy = require('./RelationshipProxy');

var _RelationshipProxy2 = _interopRequireDefault(_RelationshipProxy);

var _builders = require('../helpers/builders');

var _optionsCache = require('../helpers/optionsCache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Resource(type, api) {
    _classCallCheck(this, Resource);

    this.type = type;
    this.api = api;
    this.optionsCache = _optionsCache.optionsCache.bind(this);
    Object.freeze(this);
  }

  _createClass(Resource, [{
    key: 'list',
    value: function list(params) {
      return this.api.client.get(this.type, params).then(_processResponse2.default).then(_builders.buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'emptyCollection',
    value: function emptyCollection() {
      return new _Collection2.default({}, this.api, this);
    }
  }, {
    key: 'new',
    value: function _new(instanceData) {
      instanceData.type = this.type;
      return new _Instance2.default(instanceData, this.api);
    }
  }, {
    key: 'relatedForId',
    value: function relatedForId(id, name, params) {
      var parentInstance = this.new({ id: id });
      var url = this.type + '/' + id + '/' + name;
      return new _RelatedProxy2.default(parentInstance, name, params, url);
    }
  }, {
    key: 'relationshipForId',
    value: function relationshipForId(id, name, params) {
      var parentInstance = this.new({ id: id });
      var url = this.type + '/' + id + '/relationships/' + name;
      return new _RelationshipProxy2.default(parentInstance, name, params, url);
    }
  }, {
    key: 'create',
    value: function create(instanceData, params) {
      return this.new(instanceData).save(params);
    }
  }, {
    key: 'read',
    value: function read(id, params) {
      return new _Instance2.default({ type: this.type, id: id }, this.api).reload(params);
    }
  }, {
    key: 'uri',
    value: function uri() {
      return this.type;
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return _path2.default.join.apply(_path2.default, [this.type].concat(additions));
    }
  }, {
    key: 'options',
    value: function options() {
      return this.api.client.options(this.type).then(_processResponse2.default);
    }
  }]);

  return Resource;
}();