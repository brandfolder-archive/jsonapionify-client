"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');

var url = require('url');
var http = require('http');
var https = require('https');
var ClientResponse = require('./client_response.js');
var querystring = require('querystring');
var _ = require('lodash');

module.exports = class Client {
    constructor(baseUrl, options) {
        // Setup Headers
        options = options || {};
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
        path = path || '';
        var requestUrl;

        // Append params
        if (params) {
            path += `${path.match(/\?/) ? '&' : '?'}${querystring.stringify(params)}`;
        }

        // Build the URL
        if (url.parse(path).host) {
            requestUrl = path;
        } else if (path.indexOf(this.baseUrl) !== -1) {
            requestUrl = path;
        } else {
            requestUrl = [this.baseUrl, path].map(function (string) {
                return string.replace(/\/$/, '');
            }).join('/');
        }

        // Build the options
        options = {
            method: method,
            headers: this.headers
        };

        if (data) {
            options.body = JSON.stringify(data)
        }

        var response;

        return fetch(requestUrl, options).then(function (res) {
            response = new ClientResponse(res);
            return res.text()
        }).then(function (body) {
            response.setBody(body);
            return response;
        })
    }
};
