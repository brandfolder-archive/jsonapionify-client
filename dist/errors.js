'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class CompositeError extends Error {
  constructor(response) {
    super();
    this.response = response;
  }

  get errors() {
    return this.response.json.errors;
  }

  hasStatus(code) {
    return this.errors.filter(error => parseInt(error.status, 10) === code).length > 1;
  }

  get message() {
    return this.errors.map(function (error) {
      let msg = '';
      if (error.status) {
        msg += error.status;
      }
      if (error.title) {
        msg += msg ? ` ${ error.title }` : error.title;
      }
      if (error.detail) {
        msg += msg ? `: ${ error.detail }` : error.detail;
      }
      return msg;
    }).join(', ');
  }
}

exports.CompositeError = CompositeError;
class VerbUnsupportedError extends Error {
  constructor() {
    super(...arguments);
  }
}

exports.VerbUnsupportedError = VerbUnsupportedError;
class NotPersistedError extends Error {
  constructor() {
    super(...arguments);
  }
}

exports.NotPersistedError = NotPersistedError;
class InvalidRelationshipError extends Error {
  constructor() {
    super(...arguments);
  }
}
exports.InvalidRelationshipError = InvalidRelationshipError;