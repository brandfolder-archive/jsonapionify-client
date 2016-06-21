'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _RelatedCollection = require('./RelatedCollection');

var _RelatedCollection2 = _interopRequireDefault(_RelatedCollection);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RelatedProxy {
  constructor(instance, name, params, url) {
    this.params = params;
    this.instance = instance;
    this.name = name;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(_ref => {
      let data = _ref.data;
      return data.links.related;
    });
  }

  create() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    const instance = this.instance;
    const name = this.name;
    const getUrl = this.getUrl;

    return getUrl.then(url => {
      const collection = new _RelatedCollection2.default({ data: [], links: { self: url } }, instance, name);
      return collection.create(...args);
    });
  }

  load() {
    const instance = this.instance;
    const name = this.name;
    const params = this.params;
    const getUrl = this.getUrl;
    const api = instance.api;

    var _require = require('../helpers/builders');

    const buildCollectionOrInstance = _require.buildCollectionOrInstance;

    return getUrl.then(url => {
      return api.client.get(url, params);
    }).then(_processResponse2.default).then(response => buildCollectionOrInstance(instance, name, response));
  }

  reload() {
    return this.load();
  }

  then(fn) {
    return this.load().then(fn);
  }
}

exports.default = RelatedProxy;