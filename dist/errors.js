'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _extendableBuiltin7(cls) {
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

function _extendableBuiltin5(cls) {
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

function _extendableBuiltin3(cls) {
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

var CompositeError = exports.CompositeError = function (_extendableBuiltin2) {
  _inherits(CompositeError, _extendableBuiltin2);

  function CompositeError(response) {
    _classCallCheck(this, CompositeError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompositeError).call(this));

    _this.response = response;
    return _this;
  }

  _createClass(CompositeError, [{
    key: 'hasStatus',
    value: function hasStatus(code) {
      return this.errors.filter(function (error) {
        return parseInt(error.status, 10) === code;
      }).length > 1;
    }
  }, {
    key: 'errors',
    get: function get() {
      return this.response.json.errors;
    }
  }, {
    key: 'message',
    get: function get() {
      return this.errors.map(function (error) {
        var msg = '';
        if (error.status) {
          msg += error.status;
        }
        if (error.title) {
          msg += msg ? ' ' + error.title : error.title;
        }
        if (error.detail) {
          msg += msg ? ': ' + error.detail : error.detail;
        }
        return msg;
      }).join(', ');
    }
  }]);

  return CompositeError;
}(_extendableBuiltin(Error));

var VerbUnsupportedError = exports.VerbUnsupportedError = function (_extendableBuiltin4) {
  _inherits(VerbUnsupportedError, _extendableBuiltin4);

  function VerbUnsupportedError() {
    var _Object$getPrototypeO;

    _classCallCheck(this, VerbUnsupportedError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(VerbUnsupportedError)).call.apply(_Object$getPrototypeO, [this].concat(args)));
  }

  return VerbUnsupportedError;
}(_extendableBuiltin3(Error));

var NotPersistedError = exports.NotPersistedError = function (_extendableBuiltin6) {
  _inherits(NotPersistedError, _extendableBuiltin6);

  function NotPersistedError() {
    var _Object$getPrototypeO2;

    _classCallCheck(this, NotPersistedError);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(NotPersistedError)).call.apply(_Object$getPrototypeO2, [this].concat(args)));
  }

  return NotPersistedError;
}(_extendableBuiltin5(Error));

var InvalidRelationshipError = exports.InvalidRelationshipError = function (_extendableBuiltin8) {
  _inherits(InvalidRelationshipError, _extendableBuiltin8);

  function InvalidRelationshipError() {
    var _Object$getPrototypeO3;

    _classCallCheck(this, InvalidRelationshipError);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(InvalidRelationshipError)).call.apply(_Object$getPrototypeO3, [this].concat(args)));
  }

  return InvalidRelationshipError;
}(_extendableBuiltin7(Error));