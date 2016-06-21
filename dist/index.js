'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonApionifyLogger = exports.JSONAPIonify = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

Object.defineProperty(exports, 'jsonApionifyLogger', {
  enumerable: true,
  get: function get() {
    return _logger.jsonApionifyLogger;
  }
});

var _errors = require('./errors');

var _loop = function _loop(_key2) {
  if (_key2 === "default") return 'continue';
  Object.defineProperty(exports, _key2, {
    enumerable: true,
    get: function get() {
      return _errors[_key2];
    }
  });
};

for (var _key2 in _errors) {
  var _ret = _loop(_key2);

  if (_ret === 'continue') continue;
}

var _Client = require('./classes/Client.js');

var _Client2 = _interopRequireDefault(_Client);

var _Resource = require('./classes/Resource.js');

var _Resource2 = _interopRequireDefault(_Resource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('colors');

var JSONAPIonify = exports.JSONAPIonify = function () {
  function JSONAPIonify(baseUrl, ClientOptions) {
    _classCallCheck(this, JSONAPIonify);

    this.url = baseUrl;
    this.client = new _Client2.default(baseUrl, ClientOptions);
  }

  _createClass(JSONAPIonify, [{
    key: 'resource',
    value: function resource(name) {
      return new _Resource2.default(name, this);
    }
  }, {
    key: 'addMiddleware',
    value: function addMiddleware() {
      var _client;

      return (_client = this.client).addMiddleware.apply(_client, arguments);
    }
  }]);

  return JSONAPIonify;
}();