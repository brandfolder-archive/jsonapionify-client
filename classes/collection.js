"use strict";
const Instance = require('./instance.js');
const processResponse = require('../helpers/process_response.js');

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
        var collection = this;
        var request = this.client.post(this.links['self'], {
            data: {
                type: type,
                attributes: data
            }
        }, params);
        return request.then(processResponse).then(function (response) {
            var instance = new Instance(response.json.data, collection.client);
            collection.push(instance);
            return instance;
        })
    }

    delete(instance, params) {
        var collection = this;
        if (collection.indexOf(instance) < 0) {
            throw "instance not in collection"
        }
        return instance.delete(params).then(function () {
            collection.splice(0, collection.indexOf(instance));
        })
    };

    deleteAll(params) {
        var collection = this;
        var promises = this.map(function (instance) {
            return collection.delete(instance, params)
        });
        return Promise.all(promises).then(function () {
            return collection
        });
    }

    options(params) {
        return this.client.options(this.links['self'], params).then(processResponse)
    }
};
