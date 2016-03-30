'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonApionifyLogger = undefined;

var _stringJust = require('string-just');

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
  return (0, _stringJust.ljust)(`${ duration } ms`, '10000.00 ms'.length)[color];
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
  return `${ (0, _stringJust.ljust)(method, 'OPTIONS'.length) }`[colormap[method]];
}

function colorUrl(url) {
  return `${ url }`['white'];
}

const jsonApionifyLogger = exports.jsonApionifyLogger = request => {
  let method = request.method;
  let url = request.url;

  let start = new Date();
  return response => {
    let status = response.status;

    let duration = (new Date() - start).toFixed(2);
    global.console.log([(0, _stringJust.ljust)('JSONAPI', 10), '|', colorMethod(method), '>', colorStatus(status), '|', colorDuration(duration), '|', colorUrl(url)].join(' '));
    return response;
  };
};