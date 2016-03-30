'use strict';

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier = require('./ResourceIdentifier');

var _ResourceIdentifier2 = _interopRequireDefault(_ResourceIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class OneRelationship extends _ResourceIdentifier2.default {
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
    }, params).then(_processResponse2.default).then(function (response) {
      let relationship = new OneRelationship(relationship, response);
      return {
        relationship,
        response
      };
    });
  }
};