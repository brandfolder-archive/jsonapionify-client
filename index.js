"use strict";

var url = require('url');
var http = require('http');
var https = require('https');

var noop = function () {
};

var hereIndex = 0;
function here() {
    console.log(`here ${hereIndex}`);
    hereIndex++
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

class Client {
    constructor(baseUrl, options) {
        options = options || {};
        this.headers = options.headers || {};
        var parsedUrl = url.parse(baseUrl);

        if (process.env.http_proxy) {
            var parsedProxyUrl = url.parse(process.env.http_proxy);
            this.protocol = 'proxy';
            this.headers['Host'] = parsedUrl.hostname;
            this.host = parsedProxyUrl.host;
            this.port = parsedProxyUrl.port;
            this.path = parsedUrl.href
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
        return this.request('GET', path, undefined, params, options)
    }

    post(path, data, params, options) {
        return this.request('POST', path, data, params, options)
    }

    put(path, data, params, options) {
        return this.request('PUT', path, data, params, options)
    }

    patch(path, data, params, options) {
        return this.request('PATCH', path, data, params, options)
    }

    delete(path, params, options) {
        return this.request('DELETE', path, undefined, params, options)
    }

    request(method, path, data, params, options) {
        var client = this;
        options = options || {};
        var headers = extend({}, this.headers, options.headers);

        if (!path.match(/^https?:\/\//)) {
            path = [client.path, path].map(function (string) {
                return string.replace(/\/$/, '')
            }).join('/');
        }

        if (params) {
            path += `${path.match(/\?/) ? '&' : '?'}${querystring.stringify(params)}`
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
                        resolve(response)
                    });
                });

                // Reject Errors
                request.on('error', function (e) {
                    reject(e)
                });

                // Write Data
                if (data) {
                    request.write(JSON.stringify(data))
                }

                // End the request
                request.end();
            }
        );
    }
}

class ClientResponse {
    constructor(response) {
        this.status = response.status;
        this.headers = response.headers;
        this.body = '';
    }

    append(chunk) {
        this.body += chunk;
    }

    finish() {
        this.json = JSON.parse(this.body);
    }
}

class JSONAPIonify {
    constructor(baseUrl, ClientOptions) {
        this.client = new Client(baseUrl, ClientOptions)
    }

    resource(name) {
        return new Resource(name, this.client)
    }
}

class Resource {
    constructor(name, client) {
        this.name = name;
        this.client = client
    }

    index(params) {
        var resource = this;
        return processResponse(this.client.get(this.name, params), function (response) {
            return new Collection(response.json, resource.client)
        });
    }

    create(data, params) {
        return this.client.post(this.name, params, data)
    }

    read(id, params) {
        return processResponse(this.client.get(`${this.name}/${id}`, params), function (response) {
            return new Instance(response.json.data, this.client)
        });
    }
}

function processResponse(promise, callback) {
    callback = callback || noop;
    return new Promise(function (resolve, reject) {
        return promise.then(function (response) {
            if (response.json.errors) {
                reject(response.json.errors, response);
            } else {
                var callback_result = callback(response);
                resolve(callback_result, response)
            }
        }).catch(function (reason) {
            throw reason;
        })
    })
}

class Instance {
    constructor(data, client) {
        this.data = data;
        this.client = client;
    }

    id() {
        return this.data.id
    }

    type() {
        return this.data.type
    }

    attribute(name) {
        return this.data.attributes[name]
    }

    setAttribute(name, value) {
        this.data.attributes[name] = value;
        return this.data.attributes[name]
    }

    attributes() {
        return this.data.attributes
    }

    setAttributes(attributes) {
        this.data.attributes = attributes;
        return this.data.attributes
    }

    reload() {
        var instance = this;
        return processResponse(this.client.get(this.link('self')), function (response) {
            instance.data = response.json.data;
            return instance;
        })
    }

    link(name) {
        return this.data.links[name]
    }

    links() {
        return this.data.links
    }

    relationship_data(name) {
        var instance = this;
        return new Promise(function (resolve, reject) {
            if (instance.data.relationships == undefined) {
                instance.reload().then(function (instance) {
                    resolve(instance.data.relationships[name])
                }).catch(reject)
            } else {
                resolve(instance.data.relationships[name])
            }
        });
    }

    relationship(name) {
        this.client.get(this.relationship_data(name).links('self')).on('complete', function (data) {
            // Do something
        });
    }

    related(name) {
        var instance = this;
        return new Promise(function (resolve, reject) {
            instance.relationship_data(name).then(function (data) {
                processResponse(instance.client.get(data.links['related']), function (response) {
                    if (response.json.data instanceof Array) {
                        resolve(new Collection(response.json, instance.client), response);
                    } else if (response.json.data instanceof Object) {
                        resolve(new Instance(response.json.data, instance.client), response);
                    }
                }).catch(reject)
            })
        })
    }

}

class Collection extends Array {
    constructor(responseJson, client) {
        super();
        var collection = this;
        var data = responseJson.data || [];
        this.links = responseJson.links;
        this.meta = responseJson.meta;
        data.forEach(function (data) {
            collection.push(new Instance(data, client))
        })
    }

    first() {
        return this[0];
    }

    last() {
        return this[-1];
    }
}

var api = new JSONAPIonify('https://api.brandfolder.com/v2', {
    headers: {
        Authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25fa2V5IjpudWxsLCJ1c2VyX2tleSI6ImczbXNqZnR3In0.7URT-7wslMEtPEdRN2nC34SDyKnTNfPHFiKtnhWzl2M',
        "Content-Type": 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
    }
});

api.resource('brandfolders').index().then(function (collection) {
    collection.first().related('assets').then(function (collection) {
        console.log(collection.first())
    })
}).catch(function (reason) {
    console.error(reason)
});
