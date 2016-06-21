"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function () {
  function Response(_ref, text) {
    var ok = _ref.ok;
    var status = _ref.status;
    var statusText = _ref.statusText;
    var type = _ref.type;
    var url = _ref.url;
    var body = _ref.body;
    var headers = _ref.headers;

    _classCallCheck(this, Response);

    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
    this.url = url;
    this.body = body;
    this.headers = headers;
    this.text = text;
  }

  _createClass(Response, [{
    key: "json",
    get: function get() {
      this._json = this._json || JSON.parse(this.text);
      return this._json;
    }
  }]);

  return Response;
}();

exports.default = Response;