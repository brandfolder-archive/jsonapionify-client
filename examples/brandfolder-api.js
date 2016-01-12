"use strict";
var JSONAPIonify = require('../index.js');

var api = new JSONAPIonify('https://api.brandfolder.com/v2', {
    headers: {
        Authorization: `JWT ${process.env.BRANDFOLDER_API_KEY}`
    }
});

// Full workflow in Brandfolder
// 1. Create Brandfolder
// 2. Create Section in Created Brandfolder
// 3. Remove Pre-defined Sections
// 4. Create 15 Assets in Created Section
// 5. Upload 1 Attachment per Created Asset
api.resource('organizations').index().then(function (organizations) {
    organizations.first().related('brandfolders').then(function (brandfolders) {
        brandfolders.create('brandfolders', {name: 'Lots of Cats'}).then(function (brandfolder) {
            brandfolder.related('sections').then(function (sections) {
                sections.forEach(function(section){
                    section.delete()
                });
                sections.create('sections', {
                    name: 'Random Cats',
                    default_asset_type: 'GenericFile'
                }).then(function (section) {
                    section.related('assets').then(function (assets) {
                        for (var i = 0; i < 15; i++) {
                            (function () {
                                var count = i + 1;
                                assets.create('assets', {name: `Cat ${count}`}).then(function (asset) {
                                    asset.related('attachments').then(function (attachments) {
                                        attachments.create('attachments', {url: 'http://lorempixel.com/500/500/cats/'}).then(function (attachment) {
                                            console.log(attachment);
                                        })
                                    });
                                })
                            })()
                        }
                    })
                })
            })
        })
    })
});
