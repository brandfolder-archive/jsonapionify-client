const ResourceIdentifier = require('./resourceIdentifier');
const processResponse = require('../helpers/processResponse.js');

function itemsToResourceIdentifiers(resourceIdentifiers) {
  if (!(resourceIdentifiers instanceof Array)) {
    resourceIdentifiers = [ resourceIdentifiers ];
  }
  return resourceIdentifiers.map(function ({ type, id }) {
    return {
      type,
      id
    };
  });
}

function modifyRelationship({ api, links } , items, action, params) {
  return api.client[action](links.self, {
    data: itemsToResourceIdentifiers(items)
  }, params).then(processResponse).then(function (response) {
    var relationship = new ManyRelationship({
      api
    }, response);
    return {
      relationship,
      response
    };
  });
}

class ManyRelationship extends Array {
  constructor({ api }, { links, meta, data }) {
    super();
    this.api = api;
    this.links = Object.freeze(links);
    this.meta = Object.freeze(meta);
    this.concat((data || []).map(function (d) {
      return new ResourceIdentifier(d, this.api);
    }, this));
    Object.freeze(this);
  }

  first() {
    return this[0];
  }

  last() {
    return this[this.length - 1];
  }

  add(items, params) {
    return modifyRelationship(this, items, 'post', params);
  }

  replace(items, params) {
    return modifyRelationship(this, items, 'patch', params);
  }

  remove(items, params) {
    return modifyRelationship(this, items, 'delete', params);
  }

}

module.exports = ManyRelationship;
