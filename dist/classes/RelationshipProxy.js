'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ManyRelationship = require('./ManyRelationship');

var _ManyRelationship2 = _interopRequireDefault(_ManyRelationship);

var _OneRelationship = require('./OneRelationship');

var _OneRelationship2 = _interopRequireDefault(_OneRelationship);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function invoke(proxy, RelType, fnName) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  const instance = proxy.instance;
  const getUrl = proxy.getUrl;
  const api = instance.api;

  return getUrl.then(url => {
    const relationship = new RelType({ api }, { links: { self: url } });
    return relationship[fnName](...args);
  });
}

class RelationshipProxy {
  constructor(instance, name, params, url) {
    this.instance = instance;
    this.name = name;
    this.params = params;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(_ref => {
      let data = _ref.data;
      return data.links.related;
    });
  }

  load() {
    const getUrl = this.getUrl;
    const params = this.params;
    const instance = this.instance;
    const api = instance.api;

    var _require = require('../helpers/builders');

    const buildOneOrManyRelationship = _require.buildOneOrManyRelationship;

    return getUrl.then(url => {
      return api.client.get(url, params);
    }).then(_processResponse2.default).then(response => buildOneOrManyRelationship(instance, response));
  }

  reload() {
    return this.load();
  }

  add() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return invoke(this, _ManyRelationship2.default, 'add', ...args);
  }

  remove() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return invoke(this, _ManyRelationship2.default, 'remove', ...args);
  }

  replace(itemOrArray) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    if (itemOrArray instanceof Array) {
      return this.__invoke(_ManyRelationship2.default, 'replace', itemOrArray, ...args);
    } else if (itemOrArray instanceof Object) {
      return invoke(this, _OneRelationship2.default, 'replace', itemOrArray, ...args);
    }
  }

  then(fn) {
    return this.load().then(fn);
  }

}

exports.default = RelationshipProxy;