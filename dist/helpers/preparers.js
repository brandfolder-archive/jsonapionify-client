'use strict';

var _errors = require('../errors');

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function (_ref) {
    var json = _ref.json;

    var attributes = {};
    if (json.meta.requests[verb] === undefined) {
      throw new _errors.VerbUnsupportedError('\'' + instance.uri() + '\' does not support \'' + verb + '\'');
    }
    json.meta.requests[verb].request_attributes.forEach(function (attribute) {
      attributes[attribute.name] = instance.attributes[attribute.name];
    });
    var body = {
      data: {
        type: instance.type,
        attributes: attributes
      }
    };
    if (instance.id) {
      body.data.id = instance.id;
    }
    return body;
  });
}

function getRelationshipData(instance, name) {
  var error = new _errors.InvalidRelationshipError(name + ' is not a valid relationship');
  var api = instance.api;
  var relationships = instance.relationships;

  if (instance.relationships === undefined) {
    var fields = {};
    fields[instance.type] = name;
    return instance.reload({ fields: fields }).then(function (_ref2) {
      var reloadedInstance = _ref2.instance;

      var data = reloadedInstance.relationships[name];
      if (data === undefined) {
        throw error;
      }
      return {
        data: data,
        api: api
      };
    });
  }
  var data = relationships[name];
  if (data === undefined) {
    throw error;
  }
  return Promise.resolve({
    data: data,
    api: api
  });
}

module.exports = {
  prepareInstanceRequestBodyFor: prepareInstanceRequestBodyFor,
  getRelationshipData: getRelationshipData
};