'use strict';

const ResourceIdentifier = require('./resourceIdentifier');
const processResponse = require('../helpers/processResponse');

module.exports = class OneRelationship extends ResourceIdentifier {
  constructor(_ref, _ref2) {
    let api = _ref.api;
    let links = _ref2.links;
    let meta = _ref2.meta;
    let data = _ref2.data;

    super(data);
    this.links = links || {};
    this.meta = meta || {};
    this.api = api || {};
    Object.freeze(this);
  }

  replace(item, params) {
    this.client.patch(this.links.self, {
      data: item ? item.resourceIdentifier : null
    }, params).then(processResponse).then(function (response) {
      var relationship = new OneRelationship(relationship, response);
      return {
        relationship,
        response
      };
    });
  }
};