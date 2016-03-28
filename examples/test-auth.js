'use strict';
const { JSONAPIonify, jsonApionifyLogger } = require('../src/index.js');
const _ = require('lodash');
const stackTrace = require('stack-trace');
const readline = require('readline');

const api = new JSONAPIonify(process.env.BRANDFOLDER_API_ENDPOINT, {
  allowSetHeaders: true,
  headers: {
    'Accept': 'application/vnd.api+json; brandfolder-api=private'
  }
})

function login() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    if (process.env.BRANDFOLDER_EMAIL && process.env.BRANDFOLDER_PASSWORD){
      resolve({
        email: process.env.BRANDFOLDER_EMAIL,
        password: process.env.BRANDFOLDER_PASSWORD
      })
      return
    }
    rl.question('What is your brandfolder email? ', email => {
      rl.question('What is your brandfolder password? ', password => {
        rl.close();
        resolve({ email, password })
      })
    })
  }).then(attributes => {
    return api.resource('sessions').create({ attributes }).then(response => {
      console.log('Login Sucessful!')
      return response
    })
  }).catch(reason => {
    console.error('Login Unsucessful! Try again...');
    throw reason
  })
}

function logError(error) {
  console.error('');

  error = error.error !== undefined ? error.error : error;
  let stack = stackTrace.parse(error);
  console.error(error.toString());
  stack.forEach(function(trace, index) {
    console.error(`${index}: ${trace.getFileName()}:${trace.getLineNumber()}:in ${trace.getFunctionName()}`);
  });

  console.error('');
  process.exit(0)
};

console.log("test signin")
login().then(({ instance }) => {
  console.log(instance)
}).then(() => {
  return api.resource('users').read('current')
}).then(
  ({ instance }) => console.log(instance.attributes)
).then(() => {
  api.client.headers.authorization = '';
  console.log("test user signup")
  let email = `hello+${new Date() * 1}@example.org`;
  let password = 'testing123';
  let attributes = { email, password };
  return api.resource('users').create({ attributes })
}).then(({ instance }) => {
  console.log(instance)
}).then(() => {
  return api.resource('users').read('current')
}).then(
  ({ instance }) => console.log(instance.attributes)
).then(() => process.exit(0)).catch(logError)
