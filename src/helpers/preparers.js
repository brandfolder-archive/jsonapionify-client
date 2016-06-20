import { VerbUnsupportedError, InvalidRelationshipError } from '../errors';

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function ({ json }) {
    let attributes = {};
    if (json.meta.requests[verb] === undefined) {
      throw new VerbUnsupportedError(
        `'${instance.uri()}' does not support '${verb}'`
      );
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
  let error = new InvalidRelationshipError(
    `${name} is not a valid relationship`
  );
  let { api, relationships } = instance;
  if (instance.relationships === undefined) {
    const fields = {};
    fields[instance.type] = name;
    return instance.reload({ fields }).then(
      function ({ instance: reloadedInstance }) {
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
