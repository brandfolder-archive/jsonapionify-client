'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var Collection = function (_extendableBuiltin2) {
  _inherits(Collection, _extendableBuiltin2);

  function Collection(_ref, api, defaultResource) {
    var data = _ref.data;
    var links = _ref.links;
    var meta = _ref.meta;

    _classCallCheck(this, Collection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

    _this.api = api;
    _this.defaultResource = defaultResource;
    _this.optionsCache = _optionsCache.optionsCache.bind(_this);

    _this.links = Object.freeze(links || {});
    _this.meta = Object.freeze(meta || {});
    (data || []).forEach(function (instanceData) {
      this.push(new _Instance2.default(instanceData, api, this));
    }, _this);

    if (_this.constructor === Collection) {
      Object.freeze(_this);
    }
    return _this;
  }

  _createClass(Collection, [{
    key: 'first',
    value: function first() {
      return this[0];
    }
  }, {
    key: 'last',
    value: function last() {
      return this[this.length - 1];
    }
  }, {
    key: 'new',
    value: function _new(_ref2) {
      var type = _ref2.type;
      var attributes = _ref2.attributes;
      var id = _ref2.id;

      type = type || this.defaultResource.type;
      return new _Instance2.default({
        type: type,
        attributes: attributes,
        id: id
      }, this.api, this);
    }
  }, {
    key: 'create',
    value: function create(instanceData, params) {
      return this.new(instanceData).save(params);
    }
  }, {
    key: 'deleteAll',
    value: function deleteAll(params) {
      var api = this.api;
      var links = this.links;
      var meta = this.meta;
      var defaultResource = this.defaultResource;

      return Promise.all(this.map(function (instance) {
        return instance.delete(params);
      })).then(function (responses) {
        var collection = new Collection({
          data: [],
          links: links,
          meta: meta
        }, api, defaultResource);
        return {
          responses: responses,
          collection: collection
        };
      });
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      if (this.defaultResource) {
        var _defaultResource;

        return (_defaultResource = this.defaultResource).optionsCacheKey.apply(_defaultResource, additions);
      }
      return _path2.default.join.apply(_path2.default, [this.uri()].concat(additions));
    }
  }, {
    key: 'options',
    value: function options(params) {
      var _this2 = this;

      return (0, _optionsCache.optionsCache)(function () {
        return _this2.api.client.options(_this2.uri(), params).then(_processResponse2.default);
      });
    }
  }, {
    key: 'reload',
    value: function reload(params) {
      var _require = require('../helpers/builders');

      var buildCollectionWithResponse = _require.buildCollectionWithResponse;

      return this.api.client.get(this.uri(), params).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      var _require2 = require('../helpers/builders');

      var buildCollectionWithResponse = _require2.buildCollectionWithResponse;

      return this.api.client.get(this.links['next']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'prevPage',
    value: function prevPage() {
      var _require3 = require('../helpers/builders');

      var buildCollectionWithResponse = _require3.buildCollectionWithResponse;

      return this.api.client.get(this.links['prev']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'firstPage',
    value: function firstPage() {
      var _require4 = require('../helpers/builders');

      var buildCollectionWithResponse = _require4.buildCollectionWithResponse;

      return this.api.client.get(this.links['first']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'lastPage',
    value: function lastPage() {
      var _require5 = require('../helpers/builders');

      var buildCollectionWithResponse = _require5.buildCollectionWithResponse;

      return this.api.client.get(this.links['last']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'uri',
    value: function uri() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var u = _url2.default.parse(this.links.self || this.defaultResource.type);
      if (!params) {
        u.search = undefined;
        u.query = undefined;
      }
      return u.format();
    }
  }]);

  return Collection;
}(_extendableBuiltin(Array));

module.exports = Collection;