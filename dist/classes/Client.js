'use strict';

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Client {
  constructor(baseUrl) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let headers = _ref.headers;

    // Setup Headers
    this.middlewares = [];
    this.headers = headers || {};
    this.headers['Content-Type'] = 'application/vnd.api+json';
    this.headers['Accept'] = 'application/vnd.api+json';

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