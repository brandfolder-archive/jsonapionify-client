const { VerbUnsupportedError, InvalidRelationshipError } = require('../errors');

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function ({ json }) {
    var attributes = {};
    if (json.meta.requests[verb] === undefined) {
      throw new VerbUnsupportedError(
        `'${instance.uri()}' does not support '${verb}'`
      );
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
  var error = new InvalidRelationshipError(
    `${name} is not a valid realtionship`
  );
  var { api, relationships } = instance;
  if (instance.relationships === undefined) {
    return instance.reload({ 'include-relationships': true }).then(
      function ({ instance: reloadedInstance }) {
        var data = reloadedInstance.relationships[name];
        if (data === undefined) {
          throw error;
        }
        return {
          data,
          api
        };
      });
  }
  var data = relationships[name];
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
