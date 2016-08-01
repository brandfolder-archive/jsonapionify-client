import { CompositeError } from '../errors';

function processResponse(response) {
  return new Promise(function (resolve, reject) {
    let json = response.json;
    if (json.errors) {
      reject(new CompositeError(response));
    } else {
      resolve({
        json,
        response
      });
    }
  });
}

export default processResponse;
