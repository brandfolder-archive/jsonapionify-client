class HTTPError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name)
    }
}

for (var i = 400; i <= 599; i++) {
    (function (statusCode) {
        var baseClassName = `_${(i - i % 100) / 100}xx`;

        if (i % 100 == 0) {
            HTTPError[ baseClassName ] = class extends HTTPError {
            }
        }

        HTTPError[ `_${i}` ] = class extends HTTPError[ baseClassName ] {
            constructor() {
                super();
                this.statusCode = statusCode;
            }
        };
    })(i)
}

module.exports = HTTPError;
