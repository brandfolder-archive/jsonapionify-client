"use strict";
var ResourceIdentifier = require('./resource_identifier');

module.exports = class OneRelationship extends ResourceIdentifier {
    constructor(data, client) {
        super(data);
        this.client = client;
    }

    id() {
        return this.data.id;
    }

    type() {
        return this.data.type;
    }
};