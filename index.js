"use strict";
var Client = require('./classes/client.js');
var Resource = require('./classes/resource.js');

module.exports = class JSONAPIonify {
    constructor(baseUrl, ClientOptions) {
        this.client = new Client(baseUrl, ClientOptions);
    }

    resource(name) {
        return new Resource(name, this.client);
    }

    beforeRequest(fn){
        this.client.beforeRequest(fn)
    }
};
