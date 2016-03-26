'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

function parseParams(search) {
  if (!search) {
    return {};
  }
  return search.replace(/(^\?)/, '').split('&').reduce((params, param) => {
    let kv = param.split('=');
    let k = kv[0];
    let v = kv[1] || true;
    params[k] = v;
    return params;
  }, {});
}

class Request {
  constructor(client, method, pathname, data, params) {
    var _ref = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

    var _ref$headers = _ref.headers;
    let headers = _ref$headers === undefined ? {} : _ref$headers;

    this.client = client;
    this.data = data;
    this.path = pathname || '';
    if (params) {
      this.params = _extends({}, this.params, params);
    }
    this.method = method || 'GET';
    this.headers = headers || {};
  }

  set path(value) {
    let baseUrl = _url2.default.parse(this.client.baseUrl);
    let url = _url2.default.parse(value);
    this.params = parseParams(url.search);
    if (url.pathname.indexOf(baseUrl.path) === 0) {
      this._path = url.pathname.replace(new RegExp(`^${ baseUrl.path }`), '');
    } else {
      this._path = url.pathname;
    }
    return this._path;
  }

  get path() {
    return this._path;
  }

  get fullpath() {
    return this.urlObject.path;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this.headers[key];
  }

  set headers(val) {
    this._headers = val;
  }

  get headers() {
    return _extends({}, this.client.headers, this._headers);
  }

  addParam(key, value) {
    this.params[key] = value;
    return this.params[key];
  }

  get urlObject() {
    let baseUrl = _url2.default.parse(this.client.baseUrl);
    baseUrl.pathname = _path2.default.join(baseUrl.path, this.path);
    baseUrl.search = (0, _jqueryParam2.default)(this.params);
    return baseUrl;
  }

  get url() {
    let url = _url2.default.format(this.urlObject);
    return url;
  }

  set body(value) {
    this._body = value;
    return this.body;
  }

  get body() {
    return this._body || JSON.stringify(this.data);
  }

  invoke() {
    return this.client.middlewares.reduce((responseFns, mw) => {
      responseFns.unshift(mw(this));
      return responseFns;
    }, []).reduce((res, fn) => res.then(fn), this.invokeWithoutMiddlware());
  }

  invokeWithoutMiddlware() {
    let client = this.client;
    let method = this.method;
    let headers = this.headers;
    let body = this.body;
    if (body && this.method.toLowerCase() === 'delete') {
      headers['X-Http-Method-Override'] = this.method.toUpperCase();
      method = 'POST';
    }

    return (0, _isomorphicFetch2.default)(this.url, { headers, body, method }).then(res => {
      let headersToSet = res.headers.get('x-jsonapionify-set-headers');
      if (client.allowSetHeaders && headersToSet) {
        headersToSet.split(',').forEach(value => {
          let kv = value.split('=');
          client.headers[kv[0]] = kv[1];
        });
      }
      return res.text().then(text => new _Response2.default(res, text));
    });
  }
}

exports.default = Request;