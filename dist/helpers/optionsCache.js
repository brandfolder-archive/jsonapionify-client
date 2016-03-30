"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const optsCache = {};

function optionsCache(fn) {
  for (var _len = arguments.length, additions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    additions[_key - 1] = arguments[_key];
  }

  let expiresIn = 30000;
  let key = this.optionsCacheKey(...additions);
  let time = new Date();
  let promise;

  // Cache Hit
  if (optsCache[key] && time - optsCache[key].time < expiresIn) {
    promise = optsCache[key].promise;
  } else {
    // Cache Miss
    delete optsCache[key];
    promise = fn();
    optsCache[key] = { promise, time };
  }

  return promise.catch(reason => {
    if (optsCache[key]) {
      delete optsCache[key];
      return optionsCache(fn, ...additions);
    }
    throw reason;
  });
}

function clearOptionsCache() {
  Object.keys(optsCache).forEach(key => delete optsCache[key]);
}

exports.optionsCache = optionsCache;
exports.clearOptionsCache = clearOptionsCache;