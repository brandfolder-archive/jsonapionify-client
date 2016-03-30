'use strict';

import Client from './classes/Client.js';
import Resource from './classes/Resource.js';

require('colors');

export class JSONAPIonify {
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
}

export { jsonApionifyLogger } from './logger';
export * from './errors';
