'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require('../errors');

function processResponse(response) {
  return new Promise(function (resolve, reject) {
    var json = response.json;
    if (json.errors) {
      reject(new _errors.CompositeError(response));
    } else {
      resolve({
        json: json,
        response: response
      });
    }
  });
}

exports.default = processResponse;