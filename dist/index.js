'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonApionifyLogger = exports.JSONAPIonify = undefined;

var _logger = require('./logger');

Object.defineProperty(exports, 'jsonApionifyLogger', {
  enumerable: true,
  get: function () {
    return _logger.jsonApionifyLogger;
  }
});

var _errors = require('./errors');

for (let _key in _errors) {
  if (_key === "default") continue;
  Object.defineProperty(exports, _key, {
    enumerable: true,
    get: function () {
      return _errors[_key];
    }
  });
}

var _Client = require('./classes/Client.js');

var _Client2 = _interopRequireDefault(_Client);

var _Resource = require('./classes/Resource.js');

var _Resource2 = _interopRequireDefault(_Resource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('colors');

class JSONAPIonify {
  constructor(baseUrl, ClientOptions) {
    this.url = baseUrl;
    this.client = new _Client2.default(baseUrl, ClientOptions);
  }

  resource(name) {
    return new _Resource2.default(name, this);
  }

  addMiddleware() {
    return this.client.addMiddleware(...arguments);
  }
}

exports.JSONAPIonify = JSONAPIonify;