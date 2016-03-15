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

  addMiddleware() {
    return this.client.addMiddleware(...arguments);
  }
};

obj.jsonApionifyLogger = request => {
  var colors = require('colors');
  var colormap = {
    GET: 'green',
    POST: 'green',
    PUT: 'green',
    PATCH: 'green',
    DELETE: 'green',
    OPTIONS: 'cyan'
  }
  let start = new Date();
  return response => {
    let duration = (new Date() - start).toFixed(2);
    console.log([request.method[colormap[request.method]], request.url, `${ response.status }`, '-', `${ duration } ms`].join(' '));
    return response;
  };
};

module.exports = obj;
