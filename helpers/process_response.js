"use strict";

const _ = require('lodash');

module.exports = function processResponse(response) {
    return new Promise(function (resolve, reject) {
        if (response.json && response.json.errors) {
            var message = response.json.errors.map(function (error) {
                return _.compact([error.status, error.title, ':', error.detail]).join(' ')
            }).join(', ');
            reject(new Error(message), response);
        } else {
            resolve(response);
        }
    });
};
