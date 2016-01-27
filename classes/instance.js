"use strict";
var processResponse = require('../helpers/process_response.js');

function collectionOrInstance(response, instance) {
    var Collection = require('./collection.js');
    if (response.json.data instanceof Array) {
        return Promise.resolve(new Collection(response.json, instance.client), response);
    } else if (response.json.data instanceof Object) {
        return Promise.resolve(new Instance(response.json.data, instance.client), response);
    }
}

function oneOrManyRelationship(response, instance) {
    var ManyRelationship = require('./many_relationship.js');
    var OneRelationship = require('./one_relationship.js');
    if (response.json.data instanceof Array) {
        return Promise.resolve(new ManyRelationship(response.json, instance.client), response);
    } else if (response.json.data instanceof Object) {
        return Promise.resolve(new OneRelationship(response.json.data, instance.client), response);
    }
}


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
        return this.client.get(this.link('self')).then(processResponse).then(function (response) {
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
        if (instance.data.relationships == undefined) {
            return instance.reload().then(function (instance) {
                return instance.data.relationships[name]
            })
        } else {
            return Promise.resolve(instance.data.relationships[name]);
        }
    }

    relationship(name) {
        var instance = this;
        return instance.relationship_data(name).then(processResponse).then(function (response) {
            return instance.client.get(response.links['self'])
        }).then(processResponse).then(function (response) {
            return oneOrManyRelationship(response, instance)
        });
    }

    related(name) {
        var instance = this;
        return instance.relationship_data(name).then(processResponse).then(function (data) {
            return instance.client.get(data.links['related'])
        }).then(processResponse).then(function (response) {
            return collectionOrInstance(response, instance)
        })
    }

    update(attributes, params) {
        this.setAttributes(attributes);
        return this.save(params);
    }

    save(params) {
        var instance = this;
        var request = instance.client.patch(instance.data.links['self'], {data: instance.data}, params);
        return request.then(processResponse).then(function (response) {
            instance.data = response.json.data;
            return instance;
        });
    }

    delete(params) {
        var request = this.client.delete(this.data.links['self'], undefined, params);
        return request.then(processResponse).then(function (response) {
            return response;
        });
    }

    options(params) {
        var instance = this;
        var request = instance.client.options(instance.link('self'), params);
        return request.then(processResponse).then(function (response) {
            return response
        })
    }
};
