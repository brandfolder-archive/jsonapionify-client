'use strict';

function buildError(statusCode) {
  var baseClassName = `HTTPError${ (i - i % 100) / 100 }xx`;

  if (i % 100 === 0) {
    classes[baseClassName] = class extends classes.HTTPError {
      constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
      }
    };
  }

  classes[`HTTPError${ i }`] = class extends classes[baseClassName] {
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
};

for (var i = 400; i <= 599; i++) {
  buildError(i);
}

classes.NotPersistedError = class extends Error {
  constructor() {
    super(...arguments);
  }
};

classes.VerbUnsupportedError = class extends Error {
  constructor() {
    super(...arguments);
  }
};

module.exports = classes;