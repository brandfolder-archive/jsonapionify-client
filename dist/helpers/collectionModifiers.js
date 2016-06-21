'use strict';

var _Collection = require('../classes/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Collection Modifiers
function collectionWithoutInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  var instanceIndex = collection.indexOf(instance);
  var data = Array.of.apply(Array, _toConsumableArray(collection)).splice(0, instanceIndex);
  var links = collection.links;
  var meta = collection.meta;

  return new _Collection2.default({
    data: data,
    links: links,
    meta: meta
  }, collection.api, collection.defaultResource);
}

function collectionWithInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  var data = Array.of.apply(Array, _toConsumableArray(collection).concat([instance]));
  var links = collection.links;
  var meta = collection.meta;

  return new _Collection2.default({
    data: data,
    links: links,
    meta: meta
  }, collection.api, collection.defaultResource);
}

module.exports = {
  collectionWithInstance: collectionWithInstance,
  collectionWithoutInstance: collectionWithoutInstance
};