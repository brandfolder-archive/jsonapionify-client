'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _RelatedCollection = require('./RelatedCollection');

var _RelatedCollection2 = _interopRequireDefault(_RelatedCollection);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelatedProxy = function () {
  function RelatedProxy(instance, name, params, url) {
    _classCallCheck(this, RelatedProxy);

    this.params = params;
    this.instance = instance;
    this.name = name;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(function (_ref) {
      var data = _ref.data;
      return data.links.related;
    });
  }

  _createClass(RelatedProxy, [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var instance = this.instance;
      var name = this.name;
      var getUrl = this.getUrl;

      return getUrl.then(function (url) {
        var collection = new _RelatedCollection2.default({ data: [], links: { self: url } }, instance, name);
        return collection.create.apply(collection, args);
      });
    }
  }, {
    key: 'load',
    value: function load() {
      var instance = this.instance;
      var name = this.name;
      var params = this.params;
      var getUrl = this.getUrl;
      var api = instance.api;

      var _require = require('../helpers/builders');

      var buildCollectionOrInstance = _require.buildCollectionOrInstance;

      return getUrl.then(function (url) {
        return api.client.get(url, params);
      }).then(_processResponse2.default).then(function (response) {
        return buildCollectionOrInstance(instance, name, response);
      });
    }
  }, {
    key: 'reload',
    value: function reload() {
      return this.load();
    }
  }, {
    key: 'then',
    value: function then(fn) {
      return this.load().then(fn);
    }
  }]);

  return RelatedProxy;
}();

exports.default = RelatedProxy;