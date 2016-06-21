import path from 'path';

import processResponse from '../helpers/processResponse.js';
import Collection from './Collection.js';
import Instance from './Instance.js';
import RelatedProxy from './RelatedProxy';
import RelationshipProxy from './RelationshipProxy';
import {
  buildCollectionWithResponse
} from '../helpers/builders';
import { optionsCache } from '../helpers/optionsCache';

module.exports = class Resource {
  constructor(type, api) {
    this.type = type;
    this.api = api;
    this.optionsCache = optionsCache.bind(this);
    Object.freeze(this);
  }

  list(params) {
    return this.api.client.get(this.type, params).then(
      processResponse
    ).then(
      buildCollectionWithResponse.bind(undefined, this)
    );
  }

  emptyCollection() {
    return new Collection({}, this.api, this);
  }

  new(instanceData) {
    instanceData.type = this.type;
    return new Instance(instanceData, this.api);
  }

  relatedForId(id, name, params) {
    const parentInstance = this.new({ id });
    const url = `${this.type}/${id}/${name}`;
    return new RelatedProxy(parentInstance, name, params, url);
  }

  relationshipForId(id, name, params) {
    const parentInstance = this.new({ id });
    const url = `${this.type}/${id}/relationships/${name}`;
    return new RelationshipProxy(parentInstance, name, params, url);
  }

  create(instanceData, params) {
    return this.new(instanceData).save(params);
  }

  read(id, params) {
    return new Instance(
      { type: this.type, id },
      this.api
    ).reload(params);
  }

  uri() {
    return this.type;
  }

  optionsCacheKey(...additions) {
    return path.join(this.type, ...additions);
  }

  options() {
    return this.api.client.options(this.type).then(processResponse);
  }
};
