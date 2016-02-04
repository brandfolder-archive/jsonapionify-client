"use strict";
const ResourceIdentifier = require('./resource_identifier');
const processResponse = require('../helpers/process_response.js');

function resourceIdentifiersToData(resourceIdentifiers) {
  if (!resourceIdentifiers instanceof Array) {
    resourceIdentifiers = [resourceIdentifiers]
  }
  return resourceIdentifiers.map(function(rid) {
    return {
      id: rid.id(),
      type: rid.type()
    }
  });
}

module.exports = class ManyRelationship extends Array {
  constructor(responseJson, client) {
    super();
    this.client = client;
    this.parseResponseJson(responseJson);
  }

  parseResponseJson(responseJson) {
    this.length = 0;
    this.links = responseJson.links;
    this.meta = responseJson.meta;

    var manyRelationship = this;
    var data = responseJson.data || [];
    data.forEach(function(data) {
      manyRelationship.push(new ResourceIdentifier(data));
    });
    return manyRelationship;
  }

  first() {
    return this[0];
  }

  last() {
    return this[-1];
  }

  add(resourceIdentifiers, params) {
    var manyRelationship = this;
    var data = {
      data: resourceIdentifiersToData(resourceIdentifiers)
    };
    var request = this.client.post(this.links['self'], data, params);
    request.then(processResponse).then(function(response) {
      manyRelationship.parseResponseJson(response.json);
      return manyRelationship
    })
  }

  replace(resourceIdentifiers, params) {
    var manyRelationship = this;
    var data = {
      data: resourceIdentifiersToData(resourceIdentifiers)
    };
    var request = this.client.patch(this.links['self'], data, params);
    request.then(processResponse).then(function(response) {
      manyRelationship.parseResponseJson(response.json);
      return manyRelationship
    })
  }

  remove(resourceIdentifiers, params) {
    var manyRelationship = this;
    var data = {
      data: resourceIdentifiersToData(resourceIdentifiers)
    };
    var request = this.client.delete(this.links['self'], data, params);
    request.then(processResponse).then(function(response) {
      manyRelationship.parseResponseJson(response.json);
      return manyRelationship
    })
  }

}
