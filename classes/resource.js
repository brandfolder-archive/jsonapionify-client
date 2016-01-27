"use strict";
var processResponse = require('../helpers/process_response.js');
var Instance = require('./instance.js');
var Collection = require('./collection.js');

module.exports = class Resource {
    constructor(name, client) {
        this.name = name;
        this.client = client;
    }

    index(params) {
        var resource = this;
        var request = this.client.get(this.name, params);
        return request.then(processResponse).then(function (response) {
            return new Collection(response.json, resource.client);
        });
    }

    create(data, params) {
        return this.client.post(this.name, {attributes: data}, params);
    }

    read(id, params) {
        var resource = this;
        var request = this.client.get(`${this.name}/${id}`, params);
        return request.then(processResponse).then(function (response) {
            return new Instance(response.json.data, resource.client);
        });
    }

    options() {
        var request = this.client.options(this.name);
        return request.then(processResponse).then(function (response) {
            return response;
        });
    }
};
