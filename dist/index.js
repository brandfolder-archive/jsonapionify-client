'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client = require('./classes/Client');

var _Client2 = _interopRequireDefault(_Client);

var _Resource = require('./classes/Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _errors = require('./errors');

var Errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('colors');

var JSONAPIonify = function () {
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

JSONAPIonify.Logger = _logger2.default;
JSONAPIonify.Errors = Errors;
exports.default = JSONAPIonify;