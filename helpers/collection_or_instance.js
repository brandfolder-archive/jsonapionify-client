module.exports = function collectionOrInstance(response, api) {
  var Collection = require('../classes/collection.js');
  var Instance = require('../classes/instance.js');
  var NullInstance = require('../classes/null_instance.js');

  // Return the collection, we need to fetch the options to determine the resource type
  if (response.json.data instanceof Array) {
    return api.client.options(response.json.links['self']).then(function(optionsResponse) {
      var resource = api.resource(optionsResponse.json.meta.type)
      return Promise.resolve(new Collection(response.json, resource), response);
    })

  // Return the instance
  } else if (response.json.data instanceof Object) {
    return Promise.resolve(new Instance(response.json.data, api.resource(response.json.data.type)), response);

  // Return the null_instance, we need to fetch the options to determine the resource type
  } else if (response.json.data == null) {
    return api.client.options(response.json.links['self']).then(function(optionsResponse) {
      var resource = api.resource(optionsResponse.json.meta.type)
      return Promise.resolve(new NullInstance(resource, response.json.links['self']), response);
    })
  }
}
