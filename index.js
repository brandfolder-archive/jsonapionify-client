"use strict";
require('es6-promise').polyfill();
const Client = require('./classes/client.js');
const Resource = require('./classes/resource.js');

module.exports = class JSONAPIonify {
  constructor(baseUrl, ClientOptions) {
    this.url = baseUrl;
    this.client = new Client(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this);
  }
}
;
