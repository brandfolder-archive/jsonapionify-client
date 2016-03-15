const optsCache = {};

function optionsCache(fn, ...additions) {
  let expiresIn = 30000;
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

export { optionsCache, clearOptionsCache };
