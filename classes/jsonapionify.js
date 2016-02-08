"use strict"
const Client = require('./client.js');
const Resource = require('./resource.js');

module.exports = class JSONAPIonify {
  constructor(baseUrl, ClientOptions) {
    this.client = new Client(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this.client);
  }
}
