const ResourceIdentifier = require('./resourceIdentifier');
const processResponse = require('./processResponse');

module.exports = class OneRelationship extends ResourceIdentifier {
  constructor({ api }, { links, meta, data }) {
    super(data);
    this.links = links || {};
    this.meta = meta || {};
    this.api = api || {};
    Object.freeze(this);
  }

  replace(item, params) {
    this.client.patch(this.links.self, {
      data: item ? item.resourceIdentifier : null
    }, params).then(
      processResponse
    ).then(function (response) {
      var relationship = new OneRelationship(relationship, response);
      return {
        relationship,
        response
      };
    });
  }
};