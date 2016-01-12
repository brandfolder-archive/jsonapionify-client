"use strict"
var Client = require('./client.js');
var Resource = require('./resource.js');

module.exports = class JSONAPIonify {
    constructor(baseUrl, ClientOptions) {
        this.client = new Client(baseUrl, ClientOptions);
    }

    resource(name) {
        return new Resource(name, this.client);
    }
}