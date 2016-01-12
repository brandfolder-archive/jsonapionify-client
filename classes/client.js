"use strict";
var url = require('url');
var http = require('http');
var https = require('https');
var ClientResponse = require('./client_response.js');
var querystring = require('querystring');
var _ = require('lodash');

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

module.exports = class Client {
    constructor(baseUrl, options) {
        // Setup Headers
        this.headers = {};
        this.headers["Content-Type"] = 'application/vnd.api+json';
        this.headers["Accept"] = 'application/vnd.api+json';
        _.extend(this.headers, options.headers || {});

        // Setup Client
        var parsedUrl = url.parse(baseUrl);

        if (process.env.http_proxy) {
            var parsedProxyUrl = url.parse(process.env.http_proxy);
            this.protocol = 'proxy';
            this.headers['Host'] = parsedUrl.hostname;
            this.host = parsedProxyUrl.host;
            this.port = parsedProxyUrl.port;
            this.path = parsedUrl.href;
            switch (parsedUrl.protocol.slice(0, -1)) {
                case 'http':
                    if (parsedUrl.port != 80) {
                        this.headers['Host'] += `:${parsedUrl.port}`
                    }
                    break;
                case 'https':
                    if (parsedUrl.port != 443) {
                        this.headers['Host'] += `:${parsedUrl.port}`
                    }
                    break;
            }
        } else {
            this.protocol = parsedUrl.protocol.slice(0, -1);
            this.port = parsedUrl.port;
            this.hostname = parsedUrl.hostname;
            this.path = parsedUrl.pathname;
        }

        switch (this.protocol) {
            case 'http':
                this.agent = http;
                this.port = this.port || 80;
                break;
            case 'https':
                this.agent = https;
                this.port = this.port || 443;
                break;
            case 'proxy':
                this.agent = http;
                break;
        }
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

    delete(path, params, options) {
        return this.request('DELETE', path, undefined, params, options);
    }

    request(method, path, data, params, options) {
        var client = this;
        options = options || {};
        var headers = extend({}, this.headers, options.headers);

        if (data) {
            var body = JSON.stringify(data);
            headers['Content-Length'] = Buffer.byteLength(body, 'utf8');
        }

        if (!path.match(/^https?:\/\//)) {
            path = [client.path, path].map(function (string) {
                return string.replace(/\/$/, '');
            }).join('/');
        }

        if (params) {
            path += `${path.match(/\?/) ? '&' : '?'}${querystring.stringify(params)}`;
        }

        return new Promise(
            function (resolve, reject) {
                // Create a Request
                var request = client.agent.request({
                    method: method.toUpperCase(),
                    hostname: client.hostname,
                    port: client.port,
                    path: path,
                    headers: headers
                }, function (res) {
                    // Create the response
                    var response = new ClientResponse(res);

                    // Append to body on new chunk
                    res.on('data', function (chunk) {
                        response.append(chunk);
                    });

                    // Resolve when finished
                    res.on('end', function () {
                        response.finish();
                        resolve(response);
                    });
                });

                // Reject Errors
                request.on('error', function (e) {
                    reject(e);
                });

                // Write Data
                if (data) {
                    request.write(body);
                }

                // End the request
                request.end();
            }
        );
    }
};
