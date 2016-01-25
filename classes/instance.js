"use strict";
var processResponse = require('../helpers/process-response.js');

module.exports = class Instance {
    constructor(data, client) {
        this.data = data;
        this.client = client;
    }

    id() {
        return this.data.id;
    }

    type() {
        return this.data.type;
    }

    attribute(name) {
        return this.data.attributes[name];
    }

    setAttribute(name, value) {
        this.data.attributes[name] = value;
        return this.data.attributes[name];
    }

    attributes() {
        return this.data.attributes;
    }

    setAttributes(attributes) {
        this.data.attributes = attributes;
        return this.data.attributes;
    }

    reload() {
        var instance = this;
        return processResponse(this.client.get(this.link('self')), function (response) {
            instance.data = response.json.data;
            return instance;
        })
    }

    link(name) {
        return this.data.links[name];
    }

    links() {
        return this.data.links;
    }

    relationship_data(name) {
        var instance = this;
        return new Promise(function (resolve, reject) {
            if (instance.data.relationships == undefined) {
                instance.reload().then(function (instance) {
                    resolve(instance.data.relationships[name])
                }).catch(reject)
            } else {
                resolve(instance.data.relationships[name]);
            }
        });
    }

    relationship(name) {
        var ManyRelationship = require('./many_relationship.js');
        var OneRelationship = require('./one_relationship.js');
        var instance = this;
        return new Promise(function (resolve, reject) {
            instance.relationship_data(name).then(function (data) {
                processResponse(instance.client.get(data.links['self']), function (response) {
                    if (response.json.data instanceof Array) {
                        resolve(new ManyRelationship(response.json, instance.client), response);
                    } else if (response.json.data instanceof Object) {
                        resolve(new OneRelationship(response.json.data, instance.client), response);
                    }
                }).catch(reject);
            });
        });
    }

    related(name) {
        var instance = this;
        var Collection = require('./collection.js');
        return new Promise(function (resolve, reject) {
            instance.relationship_data(name).then(function (data) {
                processResponse(instance.client.get(data.links['related']), function (response) {
                    if (response.json.data instanceof Array) {
                        resolve(new Collection(response.json, instance.client), response);
                    } else if (response.json.data instanceof Object) {
                        resolve(new Instance(response.json.data, instance.client), response);
                    }
                }).catch(reject);
            });
        });
    }

    update(attributes, params) {
        this.setAttributes(attributes);
        return this.save(params);
    }

    save(params) {
        var instance = this;
        return processResponse(instance.client.patch(instance.data.links['self'], {data: instance.data}, params), function (response) {
            instance.data = response.json.data;
            return instance;
        });
    }

    delete(params) {
        var instance = this;
        return new Promise(function (resolve) {
            processResponse(instance.client.delete(instance.data.links['self'], params), function (response) {
                resolve(response);
            });
        });
    }

    options(){
        var instance = this;
        return processResponse(instance.client.options(instance.name), function(response){
            return response;
        });
    }
};