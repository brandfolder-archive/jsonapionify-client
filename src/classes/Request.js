'use strict';

import fetch from 'isomorphic-fetch';
import parameterize from 'jquery-param';
import Path from 'path';
import Url from 'url';

import Response from './Response';

function parseParams(search) {
  if (!search) {
    return {};
  }
  return search.replace(/(^\?)/, '').split('&').reduce((params, param) => {
    let kv = param.split('=');
    let k = kv[0];
    let v = kv[1] || true;
    params[k] = v;
    return params;
  }, {});
}

class Request {
  constructor(client, method, pathname, data, params, { headers = {} } = {}) {
    this.client = client;
    this.data = data;
    this.path = pathname || '';
    if (params) {
      this.params = {
        ...this.params,
        ...params
      };
    }
    this.method = method || 'GET';
    this.headers = headers || {};
  }

  set path(value) {
    let baseUrl = Url.parse(this.client.baseUrl);
    let url = Url.parse(value);
    this.params = parseParams(url.search);
    if (url.pathname.indexOf(baseUrl.path) === 0) {
      this._path = url.pathname.replace(new RegExp(`^${baseUrl.path}`), '');
    } else {
      this._path = url.pathname;
    }
    return this._path;
  }

  get path() {
    return this._path;
  }

  get fullpath() {
    return this.urlObject.path;
  }

  addHeader(key, value) {
    this._headers[key] = value;
    return this.headers[key];
  }

  set headers(val) {
    this._headers = val;
  }

  get headers() {
    return {
      ...this.client.headers,
      ...this._headers
    };
  }

  addParam(key, value) {
    this.params[key] = value;
    return this.params[key];
  }

  get urlObject() {
    let baseUrl = Url.parse(this.client.baseUrl);
    baseUrl.pathname = Path.join(baseUrl.path, this.path);
    baseUrl.search = parameterize(this.params);
    return baseUrl;
  }

  get url() {
    let url = Url.format(this.urlObject);
    return url;
  }

  set body(value) {
    this._body = value;
    return this.body;
  }

  get body() {
    return this._body || JSON.stringify(this.data);
  }

  invoke() {
    return this.client.middlewares.reduce((responseFns, mw) => {
      responseFns.unshift(mw(this));
      return responseFns;
    }, []).reduce(
      (res, fn) => res.then(fn),
      this.invokeWithoutMiddlware()
    );
  }

  invokeWithoutMiddlware() {
    let client = this.client;
    let method = this.method;
    let headers = this.headers;
    let body = this.body;
    if (body && this.method.toLowerCase() === 'delete') {
      headers['X-Http-Method-Override'] = this.method.toUpperCase();
      method = 'POST';
    }

    return fetch(
      this.url, { headers, body, method }
    ).then(res => {
      let headersToSet = res.headers.get('x-jsonapionify-set-headers');
      if (client.allowSetHeaders && headersToSet) {
        headersToSet.split(',').forEach(value => {
          let kv = value.split('=');
          client.headers[kv[0]] = kv[1];
        });
      }
      return res.text().then(text => new Response(res, text));
    });
  }
}

export default Request;
