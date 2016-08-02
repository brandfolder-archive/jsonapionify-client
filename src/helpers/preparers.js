import { VerbUnsupportedError, InvalidRelationshipError } from '../errors';

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(({ json }) => {
    let attributes = {};
    let relationships = {};

    if (json.meta.requests[verb] === undefined) {
      throw new VerbUnsupportedError(
        `'${instance.uri()}' does not support '${verb}'`
      );
    }

    if (instance.attributes) {
      json.meta.requests[verb].request_attributes.forEach(attr => {
        const value = instance.attributes[attr.name];
        if (value) {
          attributes[attr.name] = instance.attributes[attr.name];
        }
      });
    }

    if (instance.relationships) {
      json.meta.requests[verb].relationships.forEach(rel => {
        const value = instance.relationships[rel.name];
        if (value) {
          relationships[rel.name] = instance.relationships[rel.name];
        }
      });
    }

    let body = { data: { type: instance.type } };

    if (Object.keys(attributes)) {
      body.data.attributes = attributes;
    }

    if (Object.keys(attributes)) {
      body.data.relationships = relationships;
    }

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
