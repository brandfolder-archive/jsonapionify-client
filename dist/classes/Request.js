'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _jqueryParam = require('jquery-param');

var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _Response = require('./Response');

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseParams(search) {
  if (!search) {
    return {};
  }
  return search.replace(/(^\?)/, '').split('&').reduce(function (params, param) {
    var kv = param.split('=');
    var k = kv[0];
    var v = kv[1] || true;
    params[k] = v;
    return params;
  }, {});
}

var Request = function () {
  function Request(client, method, pathname, data, params) {
    var _ref = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;

    _classCallCheck(this, Request);

    this.client = client;
    this.data = data;
    this.path = pathname || '';
    if (params) {
      this.params = _extends({}, this.params, params);
    }
    this.method = method || 'GET';
    this.headers = headers || {};
  }

  _createClass(Request, [{
    key: 'addHeader',
    value: function addHeader(key, value) {
      this._headers[key] = value;
      return this.headers[key];
    }
  }, {
    key: 'addParam',
    value: function addParam(key, value) {
      this.params[key] = value;
      return this.params[key];
    }
  }, {
    key: 'invoke',
    value: function invoke() {
      var _this = this;

      return this.client.middlewares.reduce(function (responseFns, mw) {
        responseFns.unshift(mw(_this));
        return responseFns;
      }, []).reduce(function (res, fn) {
        return res.then(fn);
      }, this.invokeWithoutMiddlware());
    }
  }, {
    key: 'invokeWithoutMiddlware',
    value: function invokeWithoutMiddlware() {
      var client = this.client;
      var method = this.method;
      var headers = this.headers;
      var body = this.body;
      if (body && this.method.toLowerCase() === 'delete') {
        headers['X-Http-Method-Override'] = this.method.toUpperCase();
        method = 'POST';
      }

      return (0, _isomorphicFetch2.default)(this.url, { headers: headers, body: body, method: method }).then(function (res) {
        var headersToSet = res.headers.get('x-jsonapionify-set-headers');
        if (client.allowSetHeaders && headersToSet) {
          headersToSet.split(',').forEach(function (value) {
            var kv = value.split('=');
            client.headers[kv[0]] = kv[1];
          });
        }
        return res.text().then(function (text) {
          return new _Response2.default(res, text);
        });
      });
    }
  }, {
    key: 'path',
    set: function set(value) {
      var baseUrl = _url2.default.parse(this.client.baseUrl);
      var url = _url2.default.parse(value);
      this.params = parseParams(url.search);
      if (url.pathname.indexOf(baseUrl.path) === 0) {
        this._path = url.pathname.replace(new RegExp('^' + baseUrl.path), '');
      } else {
        this._path = url.pathname;
      }
      return this._path;
    },
    get: function get() {
      return this._path;
    }
  }, {
    key: 'fullpath',
    get: function get() {
      return this.urlObject.path;
    }
  }, {
    key: 'headers',
    set: function set(val) {
      this._headers = val;
    },
    get: function get() {
      return _extends({}, this.client.headers, this._headers);
    }
  }, {
    key: 'urlObject',
    get: function get() {
      var baseUrl = _url2.default.parse(this.client.baseUrl);
      baseUrl.pathname = _path2.default.join(baseUrl.path, this.path);
      baseUrl.search = (0, _jqueryParam2.default)(this.params);
      return baseUrl;
    }
  }, {
    key: 'url',
    get: function get() {
      var url = _url2.default.format(this.urlObject);
      return url;
    }
  }, {
    key: 'body',
    set: function set(value) {
      this._body = value;
      return this.body;
    },
    get: function get() {
      return this._body || JSON.stringify(this.data);
    }
  }]);

  return Request;
}();

exports.default = Request;