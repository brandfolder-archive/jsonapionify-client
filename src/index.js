'use strict';
const Client = require('./classes/Client.js');
const Resource = require('./classes/Resource.js');
const obj = require('./errors');

obj.JSONAPIonify = class {
  constructor(baseUrl, ClientOptions) {
    this.url = baseUrl;
    this.client = new Client(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this);
  }

  addMiddleware(...args) {
    return this.client.addMiddleware(...args);
  }
};

obj.jsonApionifyLogger = request => {
  let start = new Date();
  return response => {
    let duration = (new Date() - start).toFixed(2);
    console.log([
      request.method,
      request.url,
      `${response.status}`,
      '-',
      `${duration} ms`
    ].join(' '));
    return response;
  };
};

module.exports = obj;
