'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier = require('./ResourceIdentifier');

var _ResourceIdentifier2 = _interopRequireDefault(_ResourceIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function itemsToResourceIdentifiers(resourceIdentifiers) {
  if (!(resourceIdentifiers instanceof Array)) {
    resourceIdentifiers = [resourceIdentifiers];
  }
  return resourceIdentifiers.map(function (_ref) {
    var type = _ref.type;
    var id = _ref.id;

    return {
      type: type,
      id: id
    };
  });
}

function modifyRelationship(_ref2, items, action, params) {
  var api = _ref2.api;
  var links = _ref2.links;

  return api.client[action](links.self, {
    data: itemsToResourceIdentifiers(items)
  }, params).then(_processResponse2.default).then(function (response) {
    var relationship = new ManyRelationship({
      api: api
    }, response);
    return {
      relationship: relationship,
      response: response
    };
  });
}

var ManyRelationship = function (_extendableBuiltin2) {
  _inherits(ManyRelationship, _extendableBuiltin2);

  function ManyRelationship(_ref3, _ref4) {
    var api = _ref3.api;
    var links = _ref4.links;
    var meta = _ref4.meta;
    var data = _ref4.data;

    _classCallCheck(this, ManyRelationship);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ManyRelationship).call(this));

    _this.api = api;
    _this.links = Object.freeze(links);
    _this.meta = Object.freeze(meta);
    _this.concat((data || []).map(function (d) {
      return new _ResourceIdentifier2.default(d, this.api);
    }, _this));
    Object.freeze(_this);
    return _this;
  }

  _createClass(ManyRelationship, [{
    key: 'first',
    value: function first() {
      return this[0];
    }
  }, {
    key: 'last',
    value: function last() {
      return this[this.length - 1];
    }
  }, {
    key: 'add',
    value: function add(items, params) {
      return modifyRelationship(this, items, 'post', params);
    }
  }, {
    key: 'replace',
    value: function replace(items, params) {
      return modifyRelationship(this, items, 'patch', params);
    }
  }, {
    key: 'remove',
    value: function remove(items, params) {
      return modifyRelationship(this, items, 'delete', params);
    }
  }]);

  return ManyRelationship;
}(_extendableBuiltin(Array));

module.exports = ManyRelationship;