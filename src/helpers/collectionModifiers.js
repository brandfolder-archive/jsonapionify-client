const Collection = require('../classes/Collection');

// Collection Modifiers
function collectionWithoutInstance(collection, instance) {
  if (!(collection instanceof Collection) || !instance) {
    return collection;
  }
  let instanceIndex = collection.indexOf(instance);
  let data = Array.of(...collection).splice(0, instanceIndex);
  let { links, meta } = collection;
  return new Collection({
    data,
    links,
    meta
  }, collection.api, collection.defaultResource);
}

function collectionWithInstance(collection, instance) {
  if (!(collection instanceof Collection) || !instance) {
    return collection;
  }
  let data = Array.of(...collection, instance);
  let { links, meta } = collection;
  return new Collection({
    data,
    links,
    meta
  }, collection.api, collection.defaultResource);
}

module.exports = {
  collectionWithInstance,
  collectionWithoutInstance
};
