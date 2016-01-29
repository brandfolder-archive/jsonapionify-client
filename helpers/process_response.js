"use strict";

const _ = require('lodash');
const HTTPError = require('../errors.js');

module.exports = function processResponse(response) {
    return new Promise(function (resolve, reject) {
        if (response.json && response.json.errors) {
            var message = response.json.errors.map(function (error) {
                var msg = '';
                if (error.status) {
                    msg += error.status
                }
                if (error.title) {
                    msg += msg ? ` ${error.title}` : error.title
                }
                if (error.detail) {
                    msg += msg ? `: ${error.detail}` : error.detail
                }
                return msg
            }).join(', ');
            reject(new HTTPError[ `_${response.status}` ](message), response);
        } else {
            resolve(response);
        }
    });
};
