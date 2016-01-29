"use strict";

const _ = require('lodash');
const HTTPError = require('../errors.js');

module.exports = function processResponse(response) {
    return new Promise(function (resolve, reject) {
        if (response.json && response.json.errors) {
            var message = response.json.errors.map(function (error) {
                return _.compact([ error.status, error.title, ':', error.detail ]).join(' ')
            }).join(', ');
            reject(new HTTPError[ `_${response.status}` ](message), response);
        } else {
            resolve(response);
        }
    });
};
