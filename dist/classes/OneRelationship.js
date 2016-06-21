'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier2 = require('./ResourceIdentifier');

var _ResourceIdentifier3 = _interopRequireDefault(_ResourceIdentifier2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_ResourceIdentifier) {
  _inherits(OneRelationship, _ResourceIdentifier);

  function OneRelationship(_ref, _ref2) {
    var api = _ref.api;
    var links = _ref2.links;
    var meta = _ref2.meta;
    var data = _ref2.data;

    _classCallCheck(this, OneRelationship);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OneRelationship).call(this, data));

    _this.links = links || {};
    _this.meta = meta || {};
    _this.api = api || {};
    Object.freeze(_this);
    return _this;
  }

  _createClass(OneRelationship, [{
    key: 'replace',
    value: function replace(item, params) {
      this.client.patch(this.links.self, {
        data: item ? item.resourceIdentifier : null
      }, params).then(_processResponse2.default).then(function (response) {
        var relationship = new OneRelationship(relationship, response);
        return {
          relationship: relationship,
          response: response
        };
      });
    }
  }]);

  return OneRelationship;
}(_ResourceIdentifier3.default);