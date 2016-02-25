'use strict';
const Client = require('./classes/Client.js');
const Resource = require('./classes/Resource.js');

class JSONAPIonify {
  constructor(baseUrl, ClientOptions) {
    this.url = baseUrl;
    this.client = new Client(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this);
  }
}

module.exports = JSONAPIonify;
