'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ManyRelationship = require('./ManyRelationship');

var _ManyRelationship2 = _interopRequireDefault(_ManyRelationship);

var _OneRelationship = require('./OneRelationship');

var _OneRelationship2 = _interopRequireDefault(_OneRelationship);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function invoke(proxy, RelType, fnName) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var instance = proxy.instance;
  var getUrl = proxy.getUrl;
  var api = instance.api;

  return getUrl.then(function (url) {
    var relationship = new RelType({ api: api }, { links: { self: url } });
    return relationship[fnName].apply(relationship, args);
  });
}

var RelationshipProxy = function () {
  function RelationshipProxy(instance, name, params, url) {
    _classCallCheck(this, RelationshipProxy);

    this.instance = instance;
    this.name = name;
    this.params = params;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(function (_ref) {
      var data = _ref.data;
      return data.links.related;
    });
  }

  _createClass(RelationshipProxy, [{
    key: 'load',
    value: function load() {
      var getUrl = this.getUrl;
      var params = this.params;
      var instance = this.instance;
      var api = instance.api;

      var _require = require('../helpers/builders');

      var buildOneOrManyRelationship = _require.buildOneOrManyRelationship;

      return getUrl.then(function (url) {
        return api.client.get(url, params);
      }).then(_processResponse2.default).then(function (response) {
        return buildOneOrManyRelationship(instance, response);
      });
    }
  }, {
    key: 'reload',
    value: function reload() {
      return this.load();
    }
  }, {
    key: 'add',
    value: function add() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return invoke.apply(undefined, [this, _ManyRelationship2.default, 'add'].concat(args));
    }
  }, {
    key: 'remove',
    value: function remove() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return invoke.apply(undefined, [this, _ManyRelationship2.default, 'remove'].concat(args));
    }
  }, {
    key: 'replace',
    value: function replace(itemOrArray) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      if (itemOrArray instanceof Array) {
        return this.__invoke.apply(this, [_ManyRelationship2.default, 'replace', itemOrArray].concat(args));
      } else if (itemOrArray instanceof Object) {
        return invoke.apply(undefined, [this, _OneRelationship2.default, 'replace', itemOrArray].concat(args));
      }
    }
  }, {
    key: 'then',
    value: function then(fn) {
      return this.load().then(fn);
    }
  }]);

  return RelationshipProxy;
}();

exports.default = RelationshipProxy;