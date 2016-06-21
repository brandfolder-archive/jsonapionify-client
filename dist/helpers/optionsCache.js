"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var optsCache = {};

function optionsCache(fn) {
  var _this = this;

  for (var _len = arguments.length, additions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    additions[_key - 1] = arguments[_key];
  }

  var expiresIn = 30000;
  var key = this.optionsCacheKey.apply(this, additions);
  var time = new Date();
  var promise = void 0;

  // Cache Hit
  if (optsCache[key] && time - optsCache[key].time < expiresIn) {
    promise = optsCache[key].promise;
  } else {
    // Cache Miss
    delete optsCache[key];
    promise = fn();
    var retrys = 0;
    optsCache[key] = { promise: promise, time: time, retrys: retrys };
  }

  return promise.catch(function (reason) {
    if (optsCache[key]) {
      if (optsCache[key].retrys++ > 3) {
        delete optsCache[key];
        throw reason;
      }
      return optionsCache.bind(_this).apply(undefined, [fn].concat(additions));
    }
    throw reason;
  });
}

function clearOptionsCache() {
  Object.keys(optsCache).forEach(function (key) {
    return delete optsCache[key];
  });
}

exports.optionsCache = optionsCache;
exports.clearOptionsCache = clearOptionsCache;