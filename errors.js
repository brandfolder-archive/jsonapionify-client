"use strict";

class HTTPError extends Error {
    constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

for (var i = 400; i <= 599; i++) {
    (function (statusCode) {
        var baseClassName = `_${(i - i % 100) / 100}xx`;

        if (i % 100 == 0) {
            HTTPError[ baseClassName ] = class extends HTTPError {
                constructor(message, fileName, lineNumber) {
                    super(message, fileName, lineNumber);
                }
            }
        }

        HTTPError[ `_${i}` ] = class extends HTTPError[ baseClassName ] {
            constructor(message, fileName, lineNumber) {
                super(message, fileName, lineNumber);
                this.statusCode = statusCode;
            }
        };
    })(i)
}

module.exports = HTTPError;
