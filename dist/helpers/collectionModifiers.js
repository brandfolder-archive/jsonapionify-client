'use strict';

var _Collection = require('../classes/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Collection Modifiers
function collectionWithoutInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  let instanceIndex = collection.indexOf(instance);
  let data = Array.of(...collection).splice(0, instanceIndex);
  let links = collection.links;
  let meta = collection.meta;

  return new _Collection2.default({
    data,
    links,
    meta
  }, collection.api, collection.defaultResource);
}

function collectionWithInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  let data = Array.of(...collection, instance);
  let links = collection.links;
  let meta = collection.meta;

  return new _Collection2.default({
    data,
    links,
    meta
  }, collection.api, collection.defaultResource);
}

module.exports = {
  collectionWithInstance,
  collectionWithoutInstance
};