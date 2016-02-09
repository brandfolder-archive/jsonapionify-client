module.exports = function oneOrManyRelationship(response, client) {
  var ManyRelationship = require('../classes/many_relationship.js');
  var OneRelationship = require('../classes/one_relationship.js');

  if (response.json.data instanceof Array) {
    return Promise.resolve(new ManyRelationship(response.json, client), response);
  } else if (response.json.data instanceof Object) {
    return Promise.resolve(new OneRelationship(response.json.data, client), response);
  }
}
