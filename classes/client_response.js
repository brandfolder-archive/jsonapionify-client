"use strict";
const Collection = require('./collection.js');
const Instance = require('./instance.js');

module.exports = class ClientResponse {
  constructor(response) {
    this.status = response.status;
    this.headers = response.headers;
  };

  setBody(body) {
    this.body = body;
    if (this.body.length) {
      this.json = JSON.parse(this.body);
    }
  }
}
;
