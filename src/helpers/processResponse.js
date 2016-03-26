const Errors = require('../errors.js');

function errorsToMessage(errors) {
  return errors.map(function (error) {
    let msg = '';
    if (error.status) {
      msg += error.status;
    }
    if (error.title) {
      msg += msg ? ` ${error.title}` : error.title;
    }
    if (error.detail) {
      msg += msg ? `: ${error.detail}` : error.detail;
    }
    return msg;
  }).join(', ');
}

function processResponse(response) {
  return new Promise(function (resolve, reject) {
    let json = response.json;
    if (json.errors) {
      let message = errorsToMessage(json.errors);
      let error = new Errors[`HTTPError${response.status}`](message);
      reject({
        error,
        response
      });
    } else {
      resolve({
        json,
        response
      });
    }
  });
}


module.exports = processResponse;
