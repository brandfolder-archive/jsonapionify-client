const Errors = require('../errors.js');

function errorsToMessage(errors) {
  return errors.map(function (error) {
    var msg = '';
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
    var json = response.json;
    if (json.errors) {
      var message = errorsToMessage(json.errors);
      var error = new Errors[`HTTPError${response.status}`](message);
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
