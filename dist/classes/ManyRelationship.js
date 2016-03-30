'use strict';

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier = require('./ResourceIdentifier');

var _ResourceIdentifier2 = _interopRequireDefault(_ResourceIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function itemsToResourceIdentifiers(resourceIdentifiers) {
  if (!(resourceIdentifiers instanceof Array)) {
    resourceIdentifiers = [resourceIdentifiers];
  }
  return resourceIdentifiers.map(function (_ref) {
    let type = _ref.type;
    let id = _ref.id;

    return {
      type,
      id
    };
  });
}

function modifyRelationship(_ref2, items, action, params) {
  let api = _ref2.api;
  let links = _ref2.links;

  return api.client[action](links.self, {
    data: itemsToResourceIdentifiers(items)
  }, params).then(_processResponse2.default).then(function (response) {
    let relationship = new ManyRelationship({
      api
    }, response);
    return {
      relationship,
      response
    };
  });
}

class ManyRelationship extends Array {
  constructor(_ref3, _ref4) {
    let api = _ref3.api;
    let links = _ref4.links;
    let meta = _ref4.meta;
    let data = _ref4.data;

    super();
    this.api = api;
    this.links = Object.freeze(links);
    this.meta = Object.freeze(meta);
    this.concat((data || []).map(function (d) {
      return new _ResourceIdentifier2.default(d, this.api);
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