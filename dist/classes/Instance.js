'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier2 = require('./ResourceIdentifier');

var _ResourceIdentifier3 = _interopRequireDefault(_ResourceIdentifier2);

var _errors = require('../errors');

var _instanceActions = require('../helpers/instanceActions');

var _optionsCache = require('../helpers/optionsCache');

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Instance = function (_ResourceIdentifier) {
  _inherits(Instance, _ResourceIdentifier);

  function Instance(_ref, api, collection) {
    var type = _ref.type;
    var id = _ref.id;
    var attributes = _ref.attributes;
    var links = _ref.links;
    var meta = _ref.meta;
    var relationships = _ref.relationships;

    _classCallCheck(this, Instance);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Instance).call(this, {
      type: type,
      id: id
    }));

    _this.api = api;
    _this.collection = collection;
    _this.optionsCache = _optionsCache.optionsCache.bind(_this);
    _this.attributes = Object.freeze(attributes || {});
    _this.links = Object.freeze(links || {});
    _this.meta = Object.freeze(meta || {});
    _this.relationships = Object.freeze(relationships || {});

    Object.freeze(_this);
    return _this;
  }

  // Checks whether or not the instance is persisted using a very
  // small response body


  _createClass(Instance, [{
    key: 'checkPersistence',
    value: function checkPersistence() {
      var instance = this;
      var params = { fields: {} };
      params.fields[this.type] = null;
      if (this.persisted) {
        return Promise.resolve(instance);
      }
      return this.reload(params).then(function () {
        return instance;
      });
    }
  }, {
    key: 'delete',


    // Deletes an instance, returning a new instance with the same attributes, but
    // with no ID. The instance can be recreated by calling save() on the instance
    value: function _delete(params) {
      return this.checkPersistence().then(_instanceActions.deleteInstance.bind(undefined, this, params));
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      var parentKey = void 0;
      var idKey = this.persisted && this.id ? ':id' : 'new';
      if (this.collection && !this.id) {
        parentKey = this.collection.optionsCacheKey();
      } else {
        parentKey = this.resource.optionsCacheKey();
      }

      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return _path2.default.join.apply(_path2.default, [parentKey, idKey].concat(additions));
    }

    // Returns the request options

  }, {
    key: 'options',
    value: function options() {
      var _this2 = this;

      return this.optionsCache(function () {
        setTimeout(function () {
          return delete _this2.optionsCache[_this2.optionsCacheKey()];
        }, 120);
        return _this2.api.client.options(_this2.uri()).then(_processResponse2.default);
      });
    }

    // Fetches the related collection or instance

  }, {
    key: 'related',
    value: function related(name, params) {
      var RelatedProxy = require('./RelatedProxy').default;
      return new RelatedProxy(this, name, params);
    }

    // Gets options about the relation

  }, {
    key: 'relatedOptions',
    value: function relatedOptions(name) {
      var _this3 = this;

      return this.optionsCache(function () {
        return (0, _preparers.getRelationshipData)(_this3, name).then(function (_ref2) {
          var data = _ref2.data;
          var api = _ref2.api;

          return api.client.options(data.links.related);
        }).then(_processResponse2.default);
      }, name);
    }

    // Fetches the relationship

  }, {
    key: 'relationship',
    value: function relationship(name, params) {
      var RelationshipProxy = require('./RelationshipProxy').default;
      return new RelationshipProxy(this, name, params);
    }

    // Reloads the instance, returns a new instance object with the reloaded data

  }, {
    key: 'reload',
    value: function reload(params) {
      return (0, _instanceActions.reloadInstance)(this, params);
    }

    // Saves the instance, returns a new object with the saved data.

  }, {
    key: 'save',
    value: function save(params) {
      var instance = this;
      return this.checkPersistence().then(function () {
        return (0, _instanceActions.patchInstance)(instance, params);
      }).catch(function (error) {
        // Create the instance
        if (error instanceof _errors.NotPersistedError) {
          return (0, _instanceActions.postInstance)(instance, params);
        }
        throw error;
      });
    }

    // Updates and returns a new instance object with the updated attributes

  }, {
    key: 'updateAttributes',
    value: function updateAttributes(attributes, params) {
      return this.writeAttributes(attributes).then(function (_ref3) {
        var instance = _ref3.instance;

        return instance.save(params);
      });
    }
  }, {
    key: 'uri',
    value: function uri() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var selfUri = this.links.self;
      var parentUri = this.collection && this.collection.uri(false);
      var resourceUri = _lodash2.default.compact([this.type, this.id]).join('/');
      var u = _url2.default.parse(selfUri || parentUri || resourceUri);
      if (!params) {
        u.search = undefined;
        u.query = undefined;
      }
      return u.format();
    }

    // Writes the new attributes, returns an instance with the newly written
    // attributes

  }, {
    key: 'writeAttributes',
    value: function writeAttributes(attributes) {
      var _require = require('../helpers/builders');

      var buildInstanceWithAttributes = _require.buildInstanceWithAttributes;

      var newAttributes = {};
      var keys = Object.keys(this.attributes).concat(Object.keys(attributes));
      keys.forEach(function (key) {
        if (attributes[key] !== undefined) {
          newAttributes[key] = attributes[key];
        } else {
          newAttributes[key] = this.attributes[key];
        }
      }, this);
      return buildInstanceWithAttributes(this, newAttributes);
    }
  }, {
    key: 'peristed',
    get: function get() {
      return Boolean(this.links.self);
    }
  }, {
    key: 'resource',
    get: function get() {
      return this.api.resource(this.type);
    }
  }]);

  return Instance;
}(_ResourceIdentifier3.default);

module.exports = Instance;