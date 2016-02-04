"use strict";
var processResponse = require('../helpers/process_response.js');
var NullInstance = require('./null_instance.js');

function collectionOrInstance(response, api) {
  var Collection = require('./collection.js');

  // Return the collection, we need to fetch the options to determine the resource type
  if (response.json.data instanceof Array) {
    return api.client.options(response.json.links['self']).then(function(optionsResponse) {
      var resource = api.resource(optionsResponse.json.meta.type)
      return Promise.resolve(new Collection(response.json, resource), response);
    })

  // Return the instance
  } else if (response.json.data instanceof Object) {
    return Promise.resolve(new Instance(response.json.data, api.resource(response.json.data.type)), response);

  // Return the null_instance, we need to fetch the options to determine the resource type
  } else if (response.json.data == null) {
    return api.client.options(response.json.links['self']).then(function(optionsResponse) {
      var resource = api.resource(optionsResponse.json.meta.type)
      return Promise.resolve(new NullInstance(resource, response.json.links['self']), response);
    })
  }
}

function oneOrManyRelationship(response, client) {
  var ManyRelationship = require('./many_relationship.js');
  var OneRelationship = require('./one_relationship.js');
  if (response.json.data instanceof Array) {
    return Promise.resolve(new ManyRelationship(response.json, client), response);
  } else if (response.json.data instanceof Object) {
    return Promise.resolve(new OneRelationship(response.json.data, client), response);
  }
}

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

  relationship(name) {
    var instance = this;
    return instance.relationship_data(name).then(processResponse).then(function(response) {
      return instance.client.get(response.links['self'])
    }).then(processResponse).then(function(response) {
      return oneOrManyRelationship(response, instance.client)
    });
  }

  related(name) {
    var instance = this;
    return instance.relationship_data(name).then(processResponse).then(function(data) {
      return instance.client.get(data.links['related'])
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
