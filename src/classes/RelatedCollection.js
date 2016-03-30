import url from 'url';

import processResponse from '../helpers/processResponse.js';
import Collection from './Collection.js';

class RelatedCollection extends Collection {
  constructor({ data, links, meta }, parent, relName, defaultResource) {
    let { api } = parent;
    super({ data, links, meta }, api, defaultResource);
    this.parent = parent;
    this.relationshipName = relName;
    if (this.constructor === RelatedCollection) {
      Object.freeze(this);
    }
  }

  optionsCacheKey(...additions) {
    return this.parent.optionsCacheKey(this.relationshipName, ...additions);
  }

  options(params) {
    return this.api.client.options(this.uri(), params).then(processResponse);
  }

  reload(params) {
    let { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.uri(), params).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  nextPage() {
    let { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['next']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  prevPage() {
    let { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['prev']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  firstPage() {
    let { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['first']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  lastPage() {
    let { buildCollectionWithResponse } = require('../helpers/builders');
    return this.api.client.get(this.links['last']).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  uri(params = false) {
    let u = url.parse(this.links.self || this.defaultResource.type);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }
}

module.exports = RelatedCollection;
