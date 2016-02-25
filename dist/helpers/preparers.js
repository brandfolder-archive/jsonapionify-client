'use strict';

var _require = require('../errors');

const VerbUnsupportedError = _require.VerbUnsupportedError;

// Prep Instance Data

function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function (_ref) {
    let json = _ref.json;

    var attributes = {};
    if (json.meta.requests[verb] === undefined) {
      throw new VerbUnsupportedError(`'${ instance.uri() }' does not support '${ verb }'`);
    }
    json.meta.requests[verb].attributes.forEach(function (attribute) {
      attributes[attribute.name] = instance.attributes[attribute.name];
    });
    var body = {
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
  var api = instance.api;
  var relationships = instance.relationships;

  if (Object.keys(instance.relationships).length === 0) {
    return instance.reload().then(function (_ref2) {
      let reloadedInstance = _ref2.instance;

      var data = reloadedInstance.relationships[name];
      return {
        data,
        api
      };
    });
  }
  var data = relationships[name];
  return Promise.resolve({
    data,
    api
  });
}

module.exports = {
  prepareInstanceRequestBodyFor,
  getRelationshipData
};