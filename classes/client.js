"use strict";
require('isomorphic-fetch');

const url = require('url');
const http = require('http');
const https = require('https');
const ClientResponse = require('./client_response.js');
const _ = require('lodash');
const parameterize = require('jquery-param');

module.exports = class Client {
  constructor(baseUrl, options) {
    // Setup Headers
    options = options || {};
    this.noisy = !!options.noisy
    this.headers = {};
    this.headers["Content-Type"] = 'application/vnd.api+json';
    this.headers["Accept"] = 'application/vnd.api+json';
    _.extend(this.headers, options.headers || {});

    // Set baseUrl
    this.baseUrl = baseUrl;
  }

  get(path, params, options) {
    return this.request('GET', path, undefined, params, options);
  }

  post(path, data, params, options) {
    return this.request('POST', path, data, params, options);
  }

  put(path, data, params, options) {
    return this.request('PUT', path, data, params, options);
  }

  patch(path, data, params, options) {
    return this.request('PATCH', path, data, params, options);
  }

  delete(path, data, params, options) {
    return this.request('DELETE', path, data, params, options);
  }

  options(path, params, options) {
    return this.request('OPTIONS', path, undefined, params, options);
  }

  request(method, path, data, params, options) {
    var client = this;
    path = path || '';
    var requestUrl;

    // Append params
    if (params) {
      path += `${path.match(/\?/) ? '&' : '?'}${parameterize(params)}`;
    }

    // Build the URL
    if (url.parse(path).host) {
      requestUrl = path;
    } else if (path.indexOf(this.baseUrl) !== -1) {
      requestUrl = path;
    } else {
      requestUrl = [this.baseUrl, path].map(function(string) {
        return string.replace(/\/$/, '');
      }).join('/');
    }

    // Build the options
    options = {
      method: method,
      headers: this.headers
    };

    if (data) {
      if (method.toLowerCase() == 'delete') {
        options.headers['X-Http-Method-Override'] = method;
        options.method = 'POST'
      }
      options.body = JSON.stringify(data)
    }

    if (this.noisy) {
      console.log('\n')
      console.log(`${options.method} ${path} HTTP/1.1`)
      Object.keys(options.headers).forEach(function(k) {
        console.log(`> ${k}: ${options.headers[k]}`)
      })
      console.log('>')
      if (options.body) {
        console.log(options.body)
      }
    }

    var response;

    return fetch(requestUrl, options).then(function(res) {
      response = new ClientResponse(res);
      return res.text()
    }).then(function(body) {
      response.setBody(body);
      if (client.noisy) {
        console.log(`${method} ${path} HTTP/1.1`)
        debugger
        Object.keys(response.headers._headers).forEach(function(k) {
          console.log(`< ${k}: ${response.headers._headers[k]}`)
        })
        console.log('<')
        if (body) {
          console.log(body)
        }
      }
      return response;
    })
  }
}
;
