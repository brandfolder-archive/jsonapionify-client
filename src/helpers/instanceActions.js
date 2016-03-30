import processResponse from '../helpers/processResponse';
import { NotPersistedError } from '../errors';
import { prepareInstanceRequestBodyFor } from './preparers';

function reloadInstance(instance, params) {
  let { buildInstanceWithResponse } = require('./builders');
  let uri = instance.uri();
  let collectionUri = instance.collection && instance.collection.uri();
  if (uri === undefined || uri === collectionUri || instance.id === undefined) {
    return Promise.reject(new NotPersistedError('Instance is not persisted'));
  }
  return instance.api.client.get(uri, params).then(processResponse).then(
    buildInstanceWithResponse.bind(undefined, instance)
  ).catch(function (error) {
    if (error.hasStatus(404)) {
      return Promise.reject(new NotPersistedError('Instance is not persisted'));
    }
    throw error;
  });
}

function deleteInstance(instance, params) {
  let { buildDeletedInstanceWithResponse } = require('./builders');
  return instance.api.client.delete(instance.links.self, params).then(
    buildDeletedInstanceWithResponse.bind(undefined, instance)
  );
}

function patchInstance(instance, params) {
  let { buildInstanceWithResponse } = require('./builders');
  return prepareInstanceRequestBodyFor(instance, 'PATCH').then(function (body) {
    return instance.api.client.patch(instance.uri(), body, params).then(
      processResponse
    ).then(
      buildInstanceWithResponse.bind(undefined, instance)
    );
  });
}

function postInstance(instance, params) {
  let { buildInstanceWithResponse } = require('./builders');
  return prepareInstanceRequestBodyFor(instance, 'POST').then(function (body) {
    return instance.api.client.post(instance.uri(), body, params).then(
      processResponse
    ).then(
      buildInstanceWithResponse.bind(undefined, instance)
    );
  });
}

module.exports = {
  deleteInstance,
  patchInstance,
  postInstance,
  reloadInstance
};
