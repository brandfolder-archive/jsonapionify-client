"use strict";
var Collection = require('./collection.js');
var Instance = require('./instance.js');

module.exports = class ClientResponse {
    constructor(response) {
        this.status = response.statusCode;
        this.headers = response.headers;
        this.body = '';
    }

    append(chunk) {
        this.body += chunk;
    }

    finish() {
        try {
            this.json = JSON.parse(this.body);
        } catch(err) {
        }
    }
};

