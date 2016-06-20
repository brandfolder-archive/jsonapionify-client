'use strict';

var _errors = require('../errors');

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function (_ref) {
    let json = _ref.json;

    let attributes = {};
    if (json.meta.requests[verb] === undefined) {
      throw new _errors.VerbUnsupportedError(`'${ instance.uri() }' does not support '${ verb }'`);
    }
    json.meta.requests[verb].request_attributes.forEach(function (attribute) {
      attributes[attribute.name] = instance.attributes[attribute.name];
    });
    let body = {
      data: {
        type: instance.type,
        attributes
      }
    };
    if (instance.id) {
      body.data.id = instance.id;
    }
    return body;
  });
}

function getRelationshipData(instance, name) {
  let error = new _errors.InvalidRelationshipError(`${ name } is not a valid relationship`);
  let api = instance.api;
  let relationships = instance.relationships;

  if (instance.relationships === undefined) {
    const fields = {};
    fields[instance.type] = name;
    return instance.reload({ fields }).then(function (_ref2) {
      let reloadedInstance = _ref2.instance;

      let data = reloadedInstance.relationships[name];
      if (data === undefined) {
        throw error;
      }
      return {
        data,
        api
      };
    });
  }
  let data = relationships[name];
  if (data === undefined) {
    throw error;
  }
  return Promise.resolve({
    data,
    api
  });
}

module.exports = {
  prepareInstanceRequestBodyFor,
  getRelationshipData
};