"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const optsCache = {};

function optionsCache(fn) {
  let expiresIn = 30000;

  for (var _len = arguments.length, additions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    additions[_key - 1] = arguments[_key];
  }

  let key = this.optionsCacheKey(...additions);
  let time = new Date();

  // Cache Hit
  if (optsCache[key]) {
    if (time - optsCache[key].time < expiresIn) {
      return optsCache[key].promise;
    }
    delete optsCache[key];
  }

  // Cache Miss
  let promise = fn();
  optsCache[key] = { promise, time };

  return promise;
}

function clearOptionsCache() {
  Object.keys(optsCache).forEach(key => delete optsCache[key]);
}

exports.optionsCache = optionsCache;
exports.clearOptionsCache = clearOptionsCache;