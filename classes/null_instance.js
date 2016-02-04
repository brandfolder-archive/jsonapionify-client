"use strict";
var processResponse = require('../helpers/process_response.js');

module.exports = class NullInstance {
  constructor(resource, selfLink) {
    this.data = {};
    this.data.type = resource.type;
    this.data.links = {};
    this.data.attrubutes = {};

    if (selfLink) {
      this.data.links['self'] = selfLink
    }

    // Delegation
    this.resource = resource;
    this.api = resource.api
    this.client = resource.api.client;
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

  link(name) {
    return this.data.links[name];
  }

  links() {
    return this.data.links;
  }

  update(attributes, params) {
    this.setAttributes(attributes);
    return this.save(params);
  }

  save(params) {
    var instance = this;
    var request = instance.client.post(instance.data.links['self'], {
      data: instance.data
    }, params);
    return request.then(processResponse).then(function(response) {
      instance.data = response.json.data;
      return instance;
    });
  }

  options(params) {
    var instance = this;
    var request = instance.client.options(instance.link('self'), params);
    return request.then(processResponse).then(function(response) {
      return response
    })
  }

  setAttributes(attributes) {
    this.data.attributes = attributes;
    return this.data.attributes;
  }

  type() {
    return this.data.type;
  }
}
