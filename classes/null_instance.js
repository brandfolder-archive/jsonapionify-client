"use strict";
const processResponse = require('../helpers/process_response.js');

module.exports = class NullInstance {
  constructor(resource, createUrl) {
    this.data = {};
    this.data.type = resource.type;
    this.data.links = {};
    this.data.attrubutes = {};
    this.createUrl = createUrl

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

  meta(name) {
    return (this.data.meta || {})[name]
  }

  cursor() {
    return this.meta('cursor')
  }

  link(name) {
    return this.links[name]
  }

  update(attributes, params) {
    this.setAttributes(attributes);
    return this.save(params);
  }

  id() {
    return this.data.id;
  }

  isPersisted() {
    return !!this.id()
  }

  save(params) {
    var instance = this;
    var request;
    if (this.createUrl) {
      request = instance.client.post(this.createUrl, {
        data: this.data
      }, params);
    } else {
      request = this.resource.create(instance.data, params)
    }
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
