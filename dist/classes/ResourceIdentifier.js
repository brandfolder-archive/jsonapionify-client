"use strict";

module.exports = class ResourceIdentifier {
  constructor() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    let type = _ref.type;
    let id = _ref.id;

    this.type = type;
    this.id = id;
    if (this.constructor === ResourceIdentifier) {
      Object.freeze(this);
    }
  }

  resourceIdentifier() {
    return new ResourceIdentifier(this);
  }

};