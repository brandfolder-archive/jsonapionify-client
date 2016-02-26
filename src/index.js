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
};


module.exports = obj;
