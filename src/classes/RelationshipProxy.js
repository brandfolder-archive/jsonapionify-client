import processResponse from '../helpers/processResponse';
import ManyRelationship from './ManyRelationship';
import OneRelationship from './OneRelationship';
import { getRelationshipData } from '../helpers/preparers';

function invoke(proxy, RelType, fnName, ...args) {
  const { instance, getUrl } = proxy;
  const { api } = instance;
  return getUrl.then(url => {
    const relationship = new RelType(
      { api }, { links: { self: url } }
    );
    return relationship[fnName](...args);
  });
}

class RelationshipProxy {
  constructor(instance, name, params, url) {
    this.instance = instance;
    this.name = name;
    this.params = params;
    this.getUrl = url ? Promise.resolve(url) :
      getRelationshipData(instance, name).then(
        ({ data }) => data.links.related
      );
  }

  load() {
    const { getUrl, params, instance } = this;
    const { api } = instance;
    const { buildOneOrManyRelationship } = require('../helpers/builders');
    return getUrl.then(url => {
      return api.client.get(url, params);
    }).then(
      processResponse
    ).then(
      response => buildOneOrManyRelationship(instance, response)
    );
  }

  reload() {
    return this.load();
  }

  add(...args) {
    return invoke(this, ManyRelationship, 'add', ...args);
  }

  remove(...args) {
    return invoke(this, ManyRelationship, 'remove', ...args);
  }

  replace(itemOrArray, ...args) {
    if (itemOrArray instanceof Array) {
      return invoke(ManyRelationship, 'replace', itemOrArray, ...args);
    } else if (itemOrArray instanceof Object) {
      return invoke(this, OneRelationship, 'replace', itemOrArray, ...args);
    }
  }

  then(fn) {
    return this.load().then(fn);
  }

}

export default RelationshipProxy;
