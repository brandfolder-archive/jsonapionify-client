'use strict';

import Client from './classes/Client';
import Resource from './classes/Resource';
import Logger from './logger';
import * as Errors from './errors';

require('colors');

export default class JSONAPIonify {
  static Logger = Logger
  static Errors = Errors

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
