module.exports = class ResourceIdentifier {
  constructor({ type, id } = {}) {
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
