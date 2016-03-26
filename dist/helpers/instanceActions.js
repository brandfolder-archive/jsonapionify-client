'use strict';

const processResponse = require('../helpers/processResponse');

var _require = require('./preparers');

const prepareInstanceRequestBodyFor = _require.prepareInstanceRequestBodyFor;

var _require2 = require('../errors');

const HTTPError404 = _require2.HTTPError404;
const NotPersistedError = _require2.NotPersistedError;


function reloadInstance(instance, params) {
  var _require3 = require('./builders');

  let buildInstanceWithResponse = _require3.buildInstanceWithResponse;

  let uri = instance.uri();
  let collectionUri = instance.collection && instance.collection.uri();
  if (uri === undefined || uri === collectionUri || instance.id === undefined) {
    return Promise.reject(new NotPersistedError('Instance is not persisted'));
  }
  return instance.api.client.get(uri, params).then(processResponse).then(buildInstanceWithResponse.bind(undefined, instance)).catch(function (error) {
    if (error instanceof HTTPError404) {
      return Promise.reject(new NotPersistedError('Instance is not persisted'));
    }
    throw error;
  });
}

function deleteInstance(instance, params) {
  var _require4 = require('./builders');

  let buildDeletedInstanceWithResponse = _require4.buildDeletedInstanceWithResponse;

  return instance.api.client.delete(instance.links.self, params).then(buildDeletedInstanceWithResponse.bind(undefined, instance));
}

function patchInstance(instance, params) {
  var _require5 = require('./builders');

  let buildInstanceWithResponse = _require5.buildInstanceWithResponse;

  return prepareInstanceRequestBodyFor(instance, 'PATCH').then(function (body) {
    return instance.api.client.patch(instance.uri(), body, params).then(processResponse).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

function postInstance(instance, params) {
  var _require6 = require('./builders');

  let buildInstanceWithResponse = _require6.buildInstanceWithResponse;

  return prepareInstanceRequestBodyFor(instance, 'POST').then(function (body) {
    return instance.api.client.post(instance.uri(), body, params).then(processResponse).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

module.exports = {
  deleteInstance,
  patchInstance,
  postInstance,
  reloadInstance
};