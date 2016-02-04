"use strict";
var processResponse = require('../helpers/process_response.js');
var Instance = require('./instance.js');
var Collection = require('./collection.js');

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

  create(attributes, params) {
    return this.client.post(this.type, {
      data: {
        attributes: attributes
      }
    }, params);
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
