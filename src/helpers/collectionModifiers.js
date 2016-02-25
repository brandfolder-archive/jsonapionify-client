const Collection = require('../classes/Collection');

// Collection Modifiers
function collectionWithoutInstance(collection, instance) {
  if (!(collection instanceof Collection) || !instance) {
    return collection;
  }
  var instanceIndex = this.indexOf(instance);
  var data = Array.of(...collection).splice(0, instanceIndex);
  var { links, meta } = collection;
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
  var data = Array.of(...collection, instance);
  var { links, meta } = collection;
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
