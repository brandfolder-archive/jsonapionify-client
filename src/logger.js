import { ljust } from 'string-just';

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
  return `${status}`[color];
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

export default request => {
  let { method, url } = request;
  let start = new Date();
  return response => {
    let { status } = response;
    let duration = (new Date() - start).toFixed(2);
    global.console.log([
      ljust('JSONAPI', 10),
      '|',
      colorMethod(method),
      '>',
      colorStatus(status),
      '|',
      colorDuration(duration),
      '|',
      colorUrl(url)
    ].join(' '));
    return response;
  };
};
