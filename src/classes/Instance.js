import _ from 'lodash';
import path from 'path';
import url from 'url';

import processResponse from '../helpers/processResponse';
import ResourceIdentifier from './ResourceIdentifier';
import { NotPersistedError } from '../errors';
import {
  reloadInstance, patchInstance, postInstance, deleteInstance
} from '../helpers/instanceActions';
import { optionsCache } from '../helpers/optionsCache';
import { getRelationshipData } from '../helpers/preparers';

class Instance extends ResourceIdentifier {
  constructor(
    { type, id, attributes, links, meta, relationships } , api, collection
  ) {
    super({
      type,
      id
    });
    this.api = api;
    this.collection = collection;
    this.optionsCache = optionsCache.bind(this);
    this.attributes = Object.freeze(attributes || {});
    this.links = Object.freeze(links || {});
    this.meta = Object.freeze(meta || {});
    this.relationships = Object.freeze(relationships);

    Object.freeze(this);
  }

  // Checks whether or not the instance is persisted using a very
  // small response body
  checkPersistence() {
    let instance = this;
    let params = {
      fields: {},
      'include-relationships': false
    };
    params.fields[this.type] = null;
    if (this.persisted) {
      return Promise.resolve(instance);
    }
    return this.reload(params).then(function () {
      return instance;
    });
  }

  get peristed() {
    return Boolean(this.links.self);
  }

  // Deletes an instance, returning a new instance with the same attributes, but
  // with no ID. The instance can be recreated by calling save() on the instance
  delete(params) {
    return this.checkPersistence().then(
      deleteInstance.bind(undefined, this, params)
    );
  }

  get resource() {
    return this.api.resource(this.type);
  }

  optionsCacheKey(...additions) {
    let parentKey;
    let idKey = this.persisted && this.id ? ':id' : 'new';
    if (this.collection && !this.id) {
      parentKey = this.collection.optionsCacheKey();
    } else {
      parentKey = this.resource.optionsCacheKey();
    }
    return path.join(parentKey, idKey, ...additions);
  }

  // Returns the request options
  options() {
    return this.optionsCache(() => {
      setTimeout(() => delete this.optionsCache[this.optionsCacheKey()], 120);
      return this.api.client.options(this.uri()).then(
        processResponse
      );
    });
  }

  // Fetches the related collection or instance
  related(name, params) {
    const { buildCollectionOrInstance } = require('../helpers/builders');
    return getRelationshipData(this, name).then(function ({ data, api }) {
      return api.client.get(data.links.related, params);
    }).then(
      processResponse
    ).then(
      response => buildCollectionOrInstance(this, name, response)
    );
  }

  // Gets options about the relation
  relatedOptions(name) {
    return this.optionsCache(() => {
      return getRelationshipData(this, name).then(function ({ data, api }) {
        return api.client.options(data.links.related);
      }).then(
        processResponse
      );
    }, name);
  }

  // Fetches the relationship
  relationship(name, params) {
    const { buildOneOrManyRelationship } = require('../helpers/builders');
    return getRelationshipData(this, name).then(function ({ data, api }) {
      return api.client.get(data.links.self, params);
    }).then(
      processResponse
    ).then(
      buildOneOrManyRelationship.bind(undefined, this)
    );
  }

  // Reloads the instance, returns a new instance object with the reloaded data
  reload(params) {
    return reloadInstance(this, params);
  }

  // Saves the instance, returns a new object with the saved data.
  save(params) {
    let instance = this;
    return this.checkPersistence().then(function () {
      return patchInstance(instance, params);
    }).catch(function (error) { // Create the instance
      if (error instanceof NotPersistedError) {
        return postInstance(instance, params);
      }
      throw error;
    });
  }

  // Updates and returns a new instance object with the updated attributes
  updateAttributes(attributes, params) {
    return this.writeAttributes(attributes).then(function ({ instance }) {
      return instance.save(params);
    });
  }

  uri(params = false) {
    let selfUri = this.links.self;
    let parentUri = this.collection && this.collection.uri(false);
    let resourceUri = _.compact([ this.type, this.id ]).join('/');
    let u = url.parse(selfUri || parentUri || resourceUri);
    if (!params) {
      u.search = undefined;
      u.query = undefined;
    }
    return u.format();
  }

  // Writes the new attributes, returns an instance with the newly written
  // attributes
  writeAttributes(attributes) {
    const { buildInstanceWithAttributes } = require('../helpers/builders');
    let newAttributes = {};
    let keys = Object.keys(this.attributes).concat(Object.keys(attributes));
    keys.forEach(function (key) {
      if (attributes[key] !== undefined) {
        newAttributes[key] = attributes[key];
      } else {
        newAttributes[key] = this.attributes[key];
      }
    }, this);
    return buildInstanceWithAttributes(this, newAttributes);
  }
}

module.exports = Instance;
