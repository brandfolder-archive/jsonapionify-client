"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function ResourceIdentifier() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var type = _ref.type;
    var id = _ref.id;

    _classCallCheck(this, ResourceIdentifier);

    this.type = type;
    this.id = id;
    if (this.constructor === ResourceIdentifier) {
      Object.freeze(this);
    }
  }

  _createClass(ResourceIdentifier, [{
    key: "resourceIdentifier",
    value: function resourceIdentifier() {
      return new ResourceIdentifier(this);
    }
  }]);

  return ResourceIdentifier;
}();