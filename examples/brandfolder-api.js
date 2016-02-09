"use strict";
const JSONAPIonify = require('../index.js');
const crypto = require('crypto');
const _ = require('lodash');
const logError = require('../helpers/logError.js');
const url = require('url');

var opts = {
  headers: {}
};
if (process.env.BRANDFOLDER_API_KEY) {
  opts.headers.Authorization = `JWT ${process.env.BRANDFOLDER_API_KEY}`;
}
var api = new JSONAPIonify(process.env.BRANDFOLDER_API_ENDPOINT, opts);

console.log("loading organizations");
api.resource('organizations').list().then(function(organizations) { // Get brandofolders relation
  console.log("loading brandfolders");
  return organizations.first().related('brandfolders');
// }).then(function(brandfolders) {
//   return brandfolders.deleteAll()
}).then(function(brandfolders) { // Create a Brandfolder
  console.log("create brandfolder");
  return brandfolders.create({
    name: 'Lots of Cats'
  });
}).then(function(brandfolder) { // Get the sections relation
  console.log("load sections");
  return brandfolder.related('sections');
}).then(function(sections) { // Delete all the existing sections
  console.log("delete sections");
  return sections.deleteAll()
}).then(function(sections) { // Create a section
  console.log("create section");
  return sections.create({
    name: 'Random Cats',
    default_asset_type: 'GenericFile'
  })
}).then(function(section) { // Get the "assets" relation
  console.log("load assets");
  return section.related('assets')
}).then(function(assets) { // Create Some Assets
  console.log("create assets");
  return Promise.all(_.times(3, function(i) {
    var count = i + 1;
    console.log("create asset");
    return assets.create({
      name: `Cat ${count}`
    }).then(function(asset) {
      console.log("Participate in the asset")
      return asset.related("participation").then(function(participant) {
        return participant.update({
          subscribed: true
        })
      }).then(function() {
        return asset
      })
    }).then(function(asset) {
      console.log("fetch attachments");
      return asset.related('attachments')
    }).then(function(attachments) { // Create an attachment
      console.log("create attachment");
      return attachments.create({
        url: 'http://lorempixel.com/500/500/cats/'
      })
    }).then(function(attachment) {
      console.log("DONE!")
      return attachment
    });
  })).then(function() {
    return assets
  });
}).then(function(assets) {
  console.log("load first asset's brandfolder")
  return assets.first().related("brandfolder")
// }).then(function(brandfolder) {
//   console.log("update the brandfolder")
//   return brandfolder.update({
//     name: "I Hate Cats",
//     slug: "i-hate-cats"
//   })
}).then(function(brandfolder) {
  console.log("list related methods")
  var publicApi = new JSONAPIonify(process.env.BRANDFOLDER_API_ENDPOINT);

  var newAdmin = publicApi.resource("users").create({
    email: `devman+${new Date() * 1}@brandfolder.com`,
    password: 'weakpassword1'
  }).then((user) => brandfolder.relationship("admins").then((admins) => admins.add(user)))

  return Promise.all([
    newAdmin,
    brandfolder.api.resource("brandfolders").related(brandfolder.id(), "sections").then(console.log).catch(logError),
    brandfolder.api.resource("brandfolders").relationship(brandfolder.id(), "sections").then(console.log).catch(logError)
  ])
}).catch(logError);
