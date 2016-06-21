'use strict';

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _errors = require('../errors');

var _preparers = require('./preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reloadInstance(instance, params) {
  var _require = require('./builders');

  var buildInstanceWithResponse = _require.buildInstanceWithResponse;

  var uri = instance.uri();
  var collectionUri = instance.collection && instance.collection.uri();
  if (uri === undefined || uri === collectionUri || instance.id === undefined) {
    return Promise.reject(new _errors.NotPersistedError('Instance is not persisted'));
  }
  return instance.api.client.get(uri, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance)).catch(function (error) {
    if (error.hasStatus instanceof Function && error.hasStatus(404)) {
      return Promise.reject(new _errors.NotPersistedError('Instance is not persisted'));
    }
    throw error;
  });
}

function deleteInstance(instance, params) {
  var _require2 = require('./builders');

  var buildDeletedInstanceWithResponse = _require2.buildDeletedInstanceWithResponse;

  return instance.api.client.delete(instance.links.self, params).then(buildDeletedInstanceWithResponse.bind(undefined, instance));
}

function patchInstance(instance, params) {
  var _require3 = require('./builders');

  var buildInstanceWithResponse = _require3.buildInstanceWithResponse;

  return (0, _preparers.prepareInstanceRequestBodyFor)(instance, 'PATCH').then(function (body) {
    return instance.api.client.patch(instance.uri(), body, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

function postInstance(instance, params) {
  var _require4 = require('./builders');

  var buildInstanceWithResponse = _require4.buildInstanceWithResponse;

  return (0, _preparers.prepareInstanceRequestBodyFor)(instance, 'POST').then(function (body) {
    return instance.api.client.post(instance.uri(), body, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

module.exports = {
  deleteInstance: deleteInstance,
  patchInstance: patchInstance,
  postInstance: postInstance,
  reloadInstance: reloadInstance
};