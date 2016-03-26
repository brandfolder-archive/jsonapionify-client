'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Client {
  constructor(baseUrl) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$allowSetHeaders = _ref.allowSetHeaders;
    let allowSetHeaders = _ref$allowSetHeaders === undefined ? false : _ref$allowSetHeaders;
    var _ref$headers = _ref.headers;
    let headers = _ref$headers === undefined ? {} : _ref$headers;

    // Setup Headers
    this.middlewares = [];
    headers = Object.keys(headers).reduce((obj, key) => {
      let keyName = key.split('-').map(part => _lodash2.default.upperFirst(part)).join('-');
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

  addMiddleware(func) {
    this.middlewares.push(func);
  }

  // Invokes a GET against the API
  get(path, params, options) {
    return this.request('GET', path, undefined, params, options);
  }

  // Invokes a POST against the API
  post(path, data, params, options) {
    return this.request('POST', path, data, params, options);
  }

  // Invokes a PUT against the API
  put(path, data, params, options) {
    return this.request('PUT', path, data, params, options);
  }

  // Invokes a PATCH against the API
  patch(path, data, params, options) {
    return this.request('PATCH', path, data, params, options);
  }

  // Invokes a DELETE against the API
  delete(path, data, params, options) {
    return this.request('DELETE', path, data, params, options);
  }

  // Invokes OPTIONS against the API
  options(path, params, options) {
    return this.request('OPTIONS', path, undefined, params, options);
  }

  // Invokes a request again the API
  request() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new _Request2.default(this, ...args).invoke();
  }
}

module.exports = Client;