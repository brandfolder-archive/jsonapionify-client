"use strict";
const JSONAPIonify = require('../index.js');
const crypto = require('crypto');
const _ = require('lodash');

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.object(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

var opts = {};
if (process.env.BRANDFOLDER_API_KEY) {
    opts.headers.Authorization = `JWT ${process.env.BRANDFOLDER_API_KEY}`;
}
var api = new JSONAPIonify(process.env.BRANDFOLDER_ENDPOINT || "https://api.brandfolder.com/v2", opts);
api.beforeRequest(function (method, path, headers, body) {
    var sig_document = JSON.stringify({
        request_method: method,
        url: path,
        headers: _.sortKeysBy(_.reduce(headers, (result, value, key) => {
            result[key.toLowerCase()] = value;
            return result
        }, {})),
        body: body || ""
    });
    console.log(sig_document);
    headers['x-signature'] = crypto.createHmac('sha256', process.env.BRANDFOLDER_API_SHARED_SECRET || 'NONE').update(sig_document).digest('hex');
});

function start () {
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
                    sections.forEach(function (section) {
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
};

start();