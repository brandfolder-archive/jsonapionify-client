"use strict";
var Instance = require('./instance.js');
var processResponse = require('../helpers/process-response.js');

module.exports = class Collection extends Array {
    constructor(responseJson, client) {
        super();
        var collection = this;
        var data = responseJson.data || [];

        this.responseJson = responseJson;
        this.client = client;
        this.links = responseJson.links;
        this.meta = responseJson.meta;

        data.forEach(function (data) {
            collection.push(new Instance(data, client));
        });

        return collection;
    }

    first() {
        return this[0];
    }

    last() {
        return this[-1];
    }

    create(type, data, params) {
        var instance = this;
        var request = this.client.post(this.links['self'], {
            data: {
                type: type,
                attributes: data
            }
        }, params);
        return processResponse(request, function (response) {
            return new Instance(response.json.data, instance.client)
        })
    }

    options(params){
        var instance = this;
        var request = this.client.options(this.links['self'], params);
        return processResponse(request, function (response) {
            return new Instance(response.json.data, instance.client)
        })
    }
};
