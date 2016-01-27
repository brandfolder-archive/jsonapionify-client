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

    replace(resourceIdentifier, params) {
        var manyRelationship = this;
        var request = this.client.patch(this.links['self'], {data: resourceIdentifier.data}, params);
        request.then(processResponse).then(function (response) {
            manyRelationship.parseResponseJson(response.json);
            return manyRelationship
        })
    }
};
