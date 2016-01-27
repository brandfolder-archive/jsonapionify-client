"use strict";
const JSONAPIonify = require('../index.js');
const crypto = require('crypto');
const _ = require('lodash');
const logError = require('../helpers/logError.js');
const url = require('url');

var opts = {headers: {}};
if (process.env.BRANDFOLDER_API_KEY) {
    opts.headers.Authorization = `JWT ${process.env.BRANDFOLDER_API_KEY}`;
}
var api = new JSONAPIonify(process.env.BRANDFOLDER_ENDPOINT, opts);

console.log("loading organizations");
api.resource('organizations').index().then(function (organizations) { // Get brandofolders relation
    console.log("loading brandfolders");
    return organizations.first().related('brandfolders');
}).then(function (brandfolders) { // Create a Brandfolder
    console.log("create brandfolder");
    return brandfolders.create('brandfolders', {name: 'Lots of Cats'});
}).then(function (brandfolder) { // Get the sections relation
   console.log("load sections");
   return brandfolder.related('sections');
}).then(function (sections) { // Delete all the existing sections
   console.log("delete sections");
   return sections.deleteAll()
}).then(function (sections) { // Create a section
   console.log("create section");
   return sections.create('sections', {
       name: 'Random Cats',
       default_asset_type: 'GenericFile'
   })
}).then(function (section) { // Get the "assets" relation
   console.log("load assets");
   return section.related('assets')
}).then(function (assets) { // Create Some Assets
   console.log("create assets");
   return Promise.all(_.times(15, function (i) {
       var count = i + 1;
       console.log("create asset");
       return assets.create('assets', {name: `Cat ${count}`}).then(function (asset) {
           console.log("fetch attachments");
           return asset.related('attachments')
       }).then(function (attachments) { // Create an attachment
           console.log("create attachment");
           return attachments.create('attachments', {url: 'http://lorempixel.com/500/500/cats/'})
       }).then(function () {
           console.log("DONE!")
       }); // Log the attachment
   }));
}).catch(logError);
