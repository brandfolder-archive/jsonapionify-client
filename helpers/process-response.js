"use strict"

module.exports = function processResponse(promise, callback) {
    callback = callback || noop;
    return new Promise(function (resolve, reject) {
        return promise.then(function (response) {
            if (response.json.errors) {
                reject(response.json.errors, response);
            } else {
                var callback_result = callback(response);
                resolve(callback_result, response);
            }
        }).catch(function (reason) {
            throw reason;
        });
    });
}