import _ from 'lodash';

import Request from './Request';

class Client {
  constructor(baseUrl, { allowSetHeaders = false, headers = {} } = {}) {
    // Setup Headers
    this.middlewares = [];
    headers = Object.keys(headers).reduce((obj, key) => {
      let keyName = key.split('-').map(part => _.upperFirst(part)).join('-')
      obj[keyName] = headers[key];
      return obj;
    }, {});
    this.headers = {
      'Accept': headers['Accept'] || 'application/vnd.api+json',
      'Content-Type': headers['Content-Type'] || 'application/vnd.api+json'
    };
    this.headers = { ...this.headers, ...headers };
    this.allowSetHeaders = allowSetHeaders;

    // Set baseUrl
    this.baseUrl = baseUrl;
  }

  addMiddleware(func) {
    this.middlewares.push(func);
  }

  // Invokes a GET against the API
  get(path, params, options) {
    return this.request('GET', path, undefined, params, options);
  }

  // Invokes a POST against the API
  post(path, data, params, options) {
    return this.request('POST', path, data, params, options);
  }

  // Invokes a PUT against the API
  put(path, data, params, options) {
    return this.request('PUT', path, data, params, options);
  }

  // Invokes a PATCH against the API
  patch(path, data, params, options) {
    return this.request('PATCH', path, data, params, options);
  }

  // Invokes a DELETE against the API
  delete(path, data, params, options) {
    return this.request('DELETE', path, data, params, options);
  }

  // Invokes OPTIONS against the API
  options(path, params, options) {
    return this.request('OPTIONS', path, undefined, params, options);
  }

  // Invokes a request again the API
  request(...args) {
    return new Request(this, ...args).invoke();
  }
}

module.exports = Client;
