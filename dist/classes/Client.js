'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(baseUrl) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$allowSetHeaders = _ref.allowSetHeaders;
    var allowSetHeaders = _ref$allowSetHeaders === undefined ? false : _ref$allowSetHeaders;
    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;

    _classCallCheck(this, Client);

    // Setup Headers
    this.middlewares = [];
    headers = Object.keys(headers).reduce(function (obj, key) {
      var keyName = key.split('-').map(function (part) {
        return _lodash2.default.upperFirst(part);
      }).join('-');
      obj[keyName] = headers[key];
      return obj;
    }, {});
    this.headers = _extends({
      Accept: headers['Accept'] || 'application/vnd.api+json',
      'Content-Type': headers['Content-Type'] || 'application/vnd.api+json'
    }, headers);
    this.allowSetHeaders = allowSetHeaders;

    // Set baseUrl
    this.baseUrl = baseUrl;
  }

  _createClass(Client, [{
    key: 'addMiddleware',
    value: function addMiddleware(func) {
      this.middlewares.push(func);
    }

    // Invokes a GET against the API

  }, {
    key: 'get',
    value: function get(path, params, options) {
      return this.request('GET', path, undefined, params, options);
    }

    // Invokes a POST against the API

  }, {
    key: 'post',
    value: function post(path, data, params, options) {
      return this.request('POST', path, data, params, options);
    }

    // Invokes a PUT against the API

  }, {
    key: 'put',
    value: function put(path, data, params, options) {
      return this.request('PUT', path, data, params, options);
    }

    // Invokes a PATCH against the API

  }, {
    key: 'patch',
    value: function patch(path, data, params, options) {
      return this.request('PATCH', path, data, params, options);
    }

    // Invokes a DELETE against the API

  }, {
    key: 'delete',
    value: function _delete(path, data, params, options) {
      return this.request('DELETE', path, data, params, options);
    }

    // Invokes OPTIONS against the API

  }, {
    key: 'options',
    value: function options(path, params, _options) {
      return this.request('OPTIONS', path, undefined, params, _options);
    }

    // Invokes a request again the API

  }, {
    key: 'request',
    value: function request() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(_Request2.default, [null].concat([this], args)))().invoke();
    }
  }]);

  return Client;
}();

module.exports = Client;