'use strict';

const Client = require('./classes/Client.js');
const Resource = require('./classes/Resource.js');
const obj = require('./errors');

var _require = require('string-just');

const ljust = _require.ljust;

require('colors');

obj.JSONAPIonify = class {
  constructor(baseUrl, ClientOptions) {
    this.url = baseUrl;
    this.client = new Client(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this);
  }

  addMiddleware() {
    return this.client.addMiddleware(...arguments);
  }
};

function colorStatus(status) {
  let color = 'white';
  if (status < 300) {
    color = 'green';
  } else if (status < 400) {
    color = 'cyan';
  } else if (status < 500) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  return `${ status }`[color];
}

function colorDuration(duration) {
  let color = 'white';
  if (duration < 500) {
    color = 'green';
  } else if (duration < 1000) {
    color = 'yellow';
  } else if (duration < 2500) {
    color = 'magenta';
  } else {
    color = 'red';
  }
  return ljust(`${ duration } ms`, '10000.00 ms'.length)[color];
}

function colorMethod(method) {
  let colormap = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'yellow',
    PATCH: 'yellow',
    DELETE: 'red',
    OPTIONS: 'cyan',
    HEAD: 'white'
  };
  return `${ ljust(method, 'OPTIONS'.length) }`[colormap[method]];
}

function colorUrl(url) {
  return `${ url }`['white'];
}

obj.jsonApionifyLogger = request => {
  let method = request.method;
  let url = request.url;

  let start = new Date();
  return response => {
    let status = response.status;

    let duration = (new Date() - start).toFixed(2);
    console.log([ljust('JSONAPI', 10), '|', colorMethod(method), '>', colorStatus(status), '|', colorDuration(duration), '|', colorUrl(url)].join(' '));
    return response;
  };
};

module.exports = obj;