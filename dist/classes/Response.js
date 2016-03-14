"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Response {
  constructor(_ref, text) {
    let ok = _ref.ok;
    let status = _ref.status;
    let statusText = _ref.statusText;
    let type = _ref.type;
    let url = _ref.url;
    let body = _ref.body;
    let headers = _ref.headers;

    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
    this.url = url;
    this.body = body;
    this.headers = headers;
    this.text = text;
  }

  get json() {
    this._json = this._json || JSON.parse(this.text);
    return this._json;
  }
}

exports.default = Response;