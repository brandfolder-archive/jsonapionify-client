"use strict";
const processResponse = require('../helpers/process_response.js');
const Instance = require('./instance.js');
const Collection = require('./collection.js');
const collectionOrInstance = require('../helpers/collection_or_instance.js');
const oneOrManyRelationship = require('../helpers/one_or_many_relationship.js');

module.exports = class Resource {
  constructor(type, api) {
    this.type = type;
    this.api = api
    this.client = api.client;
  }

  list(params) {
    var resource = this;
    var request = this.client.get(this.type, params);
    return request.then(processResponse).then(function(response) {
      return new Collection(response.json, resource);
    });
  }

  new(attributes) {
    return new Instance({
      data: {
        type: this.type,
        attributes: attributes
      }
    })
  }

  related(id, name, params) {
    var resource = this;
    return resource.client.get(`${resource.type}/${id}/${name}`, params).then(processResponse).then(function(response) {
      return collectionOrInstance(response, resource.api)
    })
  }

  relationship(id, name, params) {
    var resource = this;
    return resource.client.get(`${resource.type}/${id}/relationships/${name}`, params).then(processResponse).then(function(response) {
      return oneOrManyRelationship(response, resource.client)
    });
  }

  create(attributes, params) {
    var resource = this;
    return this.client.post(this.type, {
      data: {
        type: this.type,
        attributes: attributes
      }
    }, params).then(processResponse).then(function(response) {
      return new Instance(response.json.data, resource)
    });
  }

  read(id, params) {
    var resource = this;
    var request = this.client.get(`${this.type}/${id}`, params);
    return request.then(processResponse).then(function(response) {
      return new Instance(response.json.data, resource);
    });
  }

  options() {
    var request = this.client.options(this.type);
    return request.then(processResponse).then(function(response) {
      return response;
    });
  }
}
;
