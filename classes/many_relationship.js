"use strict";
var ResourceIdentifier = require('./resource_identifier');

module.exports = class ManyRelationship extends Array {
    constructor(responseJson, client) {
        super();
        var manyRelationship = this;
        var data = responseJson.data || [];
        this.links = responseJson.links;
        this.meta = responseJson.meta;
        this.client = client;
        data.forEach(function (data) {
            manyRelationship.push(new ResourceIdentifier(data));
        });
        return manyRelationship;
    }

    first() {
        return this[0];
    }

    last() {
        return this[-1];
    }
};