function buildHttpError(statusCode) {
  let baseClassName = `HTTPError${(statusCode - statusCode % 100) / 100}xx`;

  if (statusCode % 100 === 0) {
    classes[baseClassName] = class extends classes.HTTPError {
      constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
      }
    };
  }

  classes[`HTTPError${statusCode}`] = class extends classes[baseClassName] {
    constructor(message, fileName, lineNumber) {
      super(message, fileName, lineNumber);
      this.statusCode = statusCode;
    }
  };
}

const classes = {};

classes.HTTPError = class extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor.name);
  }
}
;

for (let i = 400; i <= 599; i++) {
  buildHttpError(i);
}

let errorNames = [
  'InvalidRelationshipError',
  'NotPersistedError',
  'VerbUnsupportedError'
];
errorNames.forEach(function (errorName) {
  classes[errorName] = class extends Error {
    constructor(...args) {
      super(...args);
    }
  };
});

module.exports = classes;
