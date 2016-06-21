import processResponse from '../helpers/processResponse';
import RelatedCollection from './RelatedCollection';
import { getRelationshipData } from '../helpers/preparers';

class RelatedProxy {
  constructor(instance, name, params, url) {
    this.params = params;
    this.instance = instance;
    this.name = name;
    this.getUrl = url ? Promise.resolve(url) :
      getRelationshipData(instance, name).then(
        ({ data }) => data.links.related
      );
  }

  create(...args) {
    const { instance, name, getUrl } = this;
    return getUrl.then(url => {
      const collection = new RelatedCollection(
        { data: [], links: { self: url } }, instance, name
      );
      return collection.create(...args);
    });
  }

  load() {
    const { instance, name, params, getUrl } = this;
    const { api } = instance;
    const { buildCollectionOrInstance } = require('../helpers/builders');
    return getUrl.then(url => {
      return api.client.get(url, params);
    }).then(
      processResponse
    ).then(
      response => buildCollectionOrInstance(instance, name, response)
    );
  }

  reload() {
    return this.load();
  }

  then(fn) {
    return this.load().then(fn);
  }
}

export default RelatedProxy;
