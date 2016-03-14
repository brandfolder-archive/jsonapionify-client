'use strict';
const { JSONAPIonify, jsonApionifyLogger } = require('../src/index.js');
const _ = require('lodash');
const stackTrace = require('stack-trace');

function logError(error) {
  console.error('');

  error = error.error !== undefined ? error.error : error;
  var stack = stackTrace.parse(error);
  console.error(error.toString());
  stack.forEach(function(trace, index) {
    console.error(`${index}: ${trace.getFileName()}:${trace.getLineNumber()}:in ${trace.getFunctionName()}`);
  });

  console.error('');
};

var opts = {
  headers: {}
};

if (process.env.BRANDFOLDER_API_KEY) {
  opts.headers.Authorization = `JWT ${process.env.BRANDFOLDER_API_KEY}`;
}
var api = new JSONAPIonify(process.env.BRANDFOLDER_API_ENDPOINT, opts);

api.addMiddleware(jsonApionifyLogger)

console.log('loading organizations');
api.resource('organizations').list().then(function({collection: organizations}) { // Get brandofolders relation
  console.log('loading brandfolders');
  return organizations.first();
}).then(function(organization){
  return api.resource('organizations').read(organization.id)
}).then(function({ instance: organization }){
  organization.relatedOptions('brandfolders').then(({json}) => console.log(json));
  return organization.related('brandfolders');
}).then(function({collection: brandfolders}) {
  if (brandfolders.length > 3) {
    console.log('deleting last brandfolder');
    return brandfolders.last().delete();
  } else {
    return {
      collection: brandfolders
    };
  }
}).then(function({collection: brandfolders}) { // Create a Brandfolder
  console.log('create brandfolder');
  return brandfolders.create({
    attributes: {
      name: 'Lots of Cats'
    }
  });
}).then(function({instance: brandfolder}) { // Get the sections relation
  console.log('load sections');
  return brandfolder.related('sections');
}).then(function({collection: sections}) { // Delete all the existing sections
  console.log('delete sections');
  return sections.deleteAll();
}).then(function({collection: sections}) { // Create a section
  console.log('create section');
  return sections.create({
    attributes: {
      name: 'Random Cats',
      default_asset_type: 'GenericFile'
    }
  });
}).then(function({instance: section}) { // Get the "assets" relation
  console.log('load assets');
  return section.related('assets');
}).then(function({collection: assets}) { // Create Some Assets
  console.log('create assets');
  return Promise.all(_.times(3, function(i) {
    var count = i + 1;
    console.log('create asset');
    return assets.create({
      attributes: {
        name: `Cat ${count}`
      }
    }).then(function({instance: asset}) {
      console.log('Participate in the asset');
      return asset.related('participation').then(function({instance: participant}) {
        return participant.updateAttributes({
          subscribed: true
        });
      }).then(function() {
        return {
          instance: asset
        };
      });
    }).then(function({instance: asset}) {
      console.log('fetch attachments');
      return asset.related('attachments');
    }).then(function({collection: attachments}) { // Create an attachment
      console.log('create attachment');
      return attachments.create({
        attributes: {
          url: 'http://lorempixel.com/500/500/cats/'
        }
      });
    }).then(function({instance: attachment}) {
      console.log('DONE!');
      return attachment;
    });
  })).then(function() {
    return assets.reload();
  });
}).then(function({collection: assets}) {
  console.log('load first asset\'s brandfolder');
  return assets.first().updateAttributes({
    name: 'Not a cat!',
    description: 'This is not a cat',
  }).then(function({instance: asset}) {
    return asset.related('brandfolder');
  });
}).then(function({instance: brandfolder}) {
  var publicApi = new JSONAPIonify(process.env.BRANDFOLDER_API_ENDPOINT);
  var i = 0;
  return Promise.all(_.times(2, function() {
    return publicApi.resource('users').create({
      attributes: {
        email: `devman+${(new Date() * 1)}-${i++}-@brandfolder.com`,
        password: 'weakpassword1'
      }
    });
  })).then(function(results) {
    var users = results.map(function({instance: user}) {
      return user;
    });
    return brandfolder.relationship('admins').then(function({relationship: admins}) {
      admins.add(users);
    });
  }).then(function() {
    return brandfolder;
  });
}).then(function(brandfolder) {
  console.log('test resource relationships');
  return Promise.all([
    brandfolder.api.resource('brandfolders').relatedForId(brandfolder.id, 'sections').then(console.log).catch(logError),
    brandfolder.api.resource('brandfolders').relationshipForId(brandfolder.id, 'sections').then(console.log).catch(logError)
  ]);
}).catch(logError);
