"use strict";
var Collection = require('./collection.js');
var Instance = require('./instance.js');

module.exports = class ClientResponse {
    constructor(response, body) {
        this.status = response.status;
        this.headers = response.headers;
        this.body = body;
        this.json = JSON.parse(this.body);
    };
};

