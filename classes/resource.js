"use strict";
var processResponse = require('../helpers/process-response.js');
var Instance = require('./instance.js');
var Collection = require('./collection.js');

module.exports = class Resource {
    constructor(data, client) {
        this.name = name;
        this.client = client;
    }

    index(params) {
        var resource = this;
        return processResponse(this.client.get(this.name, params), function (response) {
            return new Collection(response.json, resource.client);

        });
    }

    create(data, params) {
        return this.client.post(this.name, {attributes: data}, params);
    }

    read(id, params) {
        var resource = this;
        return processResponse(this.client.get(`${this.name}/${id}`, params), function (response) {
            return new Instance(response.json.data, resource.client);
        });
    }
};