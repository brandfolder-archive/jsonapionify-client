"use strict";

module.exports = class ResourceIdentifier {
    constructor(data) {
        this.data = data;
    }

    id() {
        return this.data.id;
    }

    type() {
        return this.data.type;
    }
};