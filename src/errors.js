export class CompositeError extends Error {
  constructor(response) {
    super();
    this.response = response;
  }

  get errors() {
    return this.response.json.errors;
  }

  hasStatus(code) {
    return this.errors.filter(
      error => parseInt(error.status, 10) === code
    ).length > 1;
  }

  get message() {
    return this.errors.map(error => {
      let msg = '';
      if (error.status) {
        msg += error.status;
      }
      if (error.title) {
        msg += msg ? ` ${error.title}` : error.title;
      }
      if (error.detail) {
        msg += msg ? `: ${error.detail}` : error.detail;
      }
      return msg;
    }).join(', ');
  }
}

export class VerbUnsupportedError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export class NotPersistedError extends Error {
  constructor(...args) {
    super(...args);
  }
}

export class InvalidRelationshipError extends Error {
  constructor(...args) {
    super(...args);
  }
}
