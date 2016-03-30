const optsCache = {};

function optionsCache(fn, ...additions) {
  let expiresIn = 30000;
  let key = this.optionsCacheKey(...additions);
  let time = new Date();
  let promise;

  // Cache Hit
  if (optsCache[key]) {
    if (time - optsCache[key].time < expiresIn) {
      promise = optsCache[key].promise;
    } else {
      delete optsCache[key];
    }
  } else {
    // Cache Miss
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

export { optionsCache, clearOptionsCache };
