"use strict";
const Instance = require('./instance.js');
const processResponse = require('../helpers/process_response.js');

module.exports = class Collection extends Array {
  constructor(responseJson, resource) {
    super();
    var collection = this;
    var data = responseJson.data || [];

    this.responseJson = responseJson;
    this.resource = resource;
    this.client = resource.client;
    this.links = responseJson.links;
    this.meta = responseJson.meta;

    data.forEach(function(data) {
      collection.push(new Instance(data, resource));
    });

    return collection;
  }

  first() {
    return this[0];
  }

  last() {
    return this[-1];
  }

  link(name) {
    return this.links[name]
  }

  create(data, params) {
    var collection = this;
    var request = this.client.post(this.links['self'], {
      data: {
        type: this.resource.type,
        attributes: data
      }
    }, params);
    return request.then(processResponse).then(function(response) {
      var instance = new Instance(response.json.data, collection.resource);
      collection.push(instance);
      return instance;
    })
  }

  createWithId(id, attributes, params) {
    var collection = this;
    var request = this.client.post(this.links['self'], {
      data: {
        id: id,
        type: this.resource.type,
        attributes: attributes
      }
    }, params);
    return request.then(processResponse).then(function(response) {
      var instance = new Instance(response.json.data, collection.resource);
      collection.push(instance);
      return instance;
    })
  }

  delete(instance, params) {
    var collection = this;
    if (collection.indexOf(instance) < 0) {
      throw "instance not in collection"
    }
    return instance.delete(params).then(function() {
      collection.splice(0, collection.indexOf(instance));
    })
  };

  deleteAll(params) {
    var collection = this;
    var promises = this.map(function(instance) {
      return collection.delete(instance, params)
    });
    return Promise.all(promises).then(function() {
      return collection
    });
  }

  options(params) {
    return this.client.options(this.links['self'], params).then(processResponse)
  }
}
