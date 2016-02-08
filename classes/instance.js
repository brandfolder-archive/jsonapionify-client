"use strict";
const processResponse = require('../helpers/process_response.js');
const NullInstance = require('./null_instance.js');
const collectionOrInstance = require('../helpers/collection_or_instance.js');
const oneOrManyRelationship = require('../helpers/one_or_many_relationship.js');

class Instance extends NullInstance {
  constructor(data, resource) {
    super(resource)
    this.data = data;
    this.data.type = this.data.type || resource.type;
  }

  id() {
    return this.data.id;
  }

  reload() {
    var instance = this;
    return this.client.get(this.link('self')).then(processResponse).then(function(response) {
      instance.data = response.json.data;
      return instance;
    })
  }

  relationship_data(name) {
    var instance = this;
    if (instance.data.relationships == undefined) {
      return instance.reload().then(function(instance) {
        return instance.data.relationships[name]
      })
    } else {
      return Promise.resolve(instance.data.relationships[name]);
    }
  }

  relationship(name, params) {
    var instance = this;
    return instance.relationship_data(name).then(processResponse).then(function(response) {
      return instance.client.get(response.links['self'], params)
    }).then(processResponse).then(function(response) {
      return oneOrManyRelationship(response, instance.client)
    });
  }

  related(name, params) {
    var instance = this;
    return instance.relationship_data(name).then(processResponse).then(function(data) {
      return instance.client.get(data.links['related'], params)
    }).then(processResponse).then(function(response) {
      return collectionOrInstance(response, instance.api)
    })
  }

  save(params) {
    var instance = this;
    var request = instance.client.patch(instance.data.links['self'], {
      data: instance.data
    }, params);
    return request.then(processResponse).then(function(response) {
      instance.data = response.json.data;
      return instance;
    });
  }

  delete(params) {
    var request = this.client.delete(this.data.links['self'], undefined, params);
    return request.then(processResponse).then(function(response) {
      return response;
    });
  }
}

module.exports = Instance;
