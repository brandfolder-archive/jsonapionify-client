'use strict';

require('isomorphic-fetch');
const Url = require('url');
const parameterize = require('jquery-param');
const fetch = require('isomorphic-fetch');

class Client {
  constructor(baseUrl) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    let headers = _ref.headers;

    // Setup Headers
    this.headers = headers || {};
    this.headers['Content-Type'] = 'application/vnd.api+json';
    this.headers['Accept'] = 'application/vnd.api+json';

    // Set baseUrl
    this.baseUrl = baseUrl;
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
  request(method) {
    let path = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    let data = arguments[2];
    let params = arguments[3];

    var _ref2 = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

    var _ref2$headers = _ref2.headers;
    let headers = _ref2$headers === undefined ? {} : _ref2$headers;

    var requestUrl;
    var body;

    // Append params
    if (params) {
      path += `${ path.match(/\?/) ? '&' : '?' }${ parameterize(params) }`;
    }

    // Build the URL
    if (Url.parse(path).host) {
      requestUrl = path;
    } else if (path.indexOf(this.baseUrl) !== -1) {
      requestUrl = path;
    } else {
      requestUrl = [this.baseUrl, path].map(function (string) {
        return string.replace(/\/$/, '');
      }).join('/');
    }

    // Build the options
    var headerKeys = Object.keys(headers).concat(Object.keys(this.headers));
    headerKeys.forEach(function (key) {
      headers[key] = headers && headers[key] || this.headers[key];
    }, this);

    // Overide DELETE if there is a body present
    if (data) {
      if (method.toLowerCase() === 'delete') {
        headers['X-Http-Method-Override'] = method;
        method = 'POST';
      }
      body = JSON.stringify(data);
    }

    // Return the response
    return fetch(requestUrl, {
      headers,
      body,
      method
    }).then(function (response) {
      return response.text().then(buildResponse.bind(this, response));
    });
  }
}

function buildResponse(_ref3, text) {
  let ok = _ref3.ok;
  let status = _ref3.status;
  let statusText = _ref3.statusText;
  let type = _ref3.type;
  let url = _ref3.url;
  let body = _ref3.body;
  let headers = _ref3.headers;

  var parsedJson;
  var json = function () {
    parsedJson = parsedJson || JSON.parse(text);
    return parsedJson;
  };

  return {
    ok,
    status,
    statusText,
    type,
    url,
    body,
    headers,
    text,
    json
  };
}

module.exports = Client;