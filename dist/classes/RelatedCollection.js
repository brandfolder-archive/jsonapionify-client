'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Collection2 = require('./Collection.js');

var _Collection3 = _interopRequireDefault(_Collection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RelatedCollection = function (_Collection) {
  _inherits(RelatedCollection, _Collection);

  function RelatedCollection(_ref, parent, relName, defaultResource) {
    var data = _ref.data;
    var links = _ref.links;
    var meta = _ref.meta;

    _classCallCheck(this, RelatedCollection);

    var api = parent.api;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RelatedCollection).call(this, { data: data, links: links, meta: meta }, api, defaultResource));

    _this.parent = parent;
    _this.relationshipName = relName;
    if (_this.constructor === RelatedCollection) {
      Object.freeze(_this);
    }
    return _this;
  }

  _createClass(RelatedCollection, [{
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      var _parent;

      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return (_parent = this.parent).optionsCacheKey.apply(_parent, [this.relationshipName].concat(additions));
    }
  }, {
    key: 'options',
    value: function options(params) {
      return this.api.client.options(this.uri(), params).then(_processResponse2.default);
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

  return RelatedCollection;
}(_Collection3.default);

module.exports = RelatedCollection;