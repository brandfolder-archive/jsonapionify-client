"use strict";
var Client = require('./classes/client.js');
var Resource = require('./classes/resource.js');
// var Instance = require('./instance.js');
// var Collection = require('./collection.js');

var url = require('url');
var http = require('http');
var https = require('https');
var _ = require('lodash');

var noop = function () {
};

class JSONAPIonify {
    constructor(baseUrl, ClientOptions) {
        this.client = new Client(baseUrl, ClientOptions);
    }

    resource(name) {
        return new Resource(name, this.client);
    }
}

var api = new JSONAPIonify('http://api.lvh.me:3000/v2', {
    headers: {
        Authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2tleSI6Imo4eW9wZnZmIn0.krZaoDaPN3z0T2WKoeF3XEmiW8oFu4Qb0ebRk--yJvc',
        "Content-Type": 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
    }
});

//api.resource('assets').read('yav8mgaw').then(function(instance){
//    instance.relationship('attachments').then(function(manyRelationship) {
//        console.log(manyRelationship);
//    });
//}).catch(function(reason) { console.log(reason); });

//api.resource('brandfolders').read('rvnxuxgd1f8c').then(function(instance){
//    console.log(instance.attribute('name'));
//    instance.update({'data': { 'type': 'brandfolders', 'attributes': {'name': 'Millineal Falcon Thing'}}}).then(function (instance) {
//        console.log(instance);
//    });
//});

//api.resource('brandfolders').read('rvnxuxgd1f8c').then(function(instance){
//    instance.delete().then(function (instance) {
//        console.log(instance);
//    });
//});

//api.resource('brandfolders').index().then(function (collection) {
//    console.log(collection);
//    collection.first().relationship('assets').then(function (collection) {
//        console.log(collection.length);
//    });
//}).catch(function (reason) {
//    console.error(reason);
//});

function JsonAPIToGraphQL(JsonAPIObj) {
    var GraphQLObj = {};
    _.extend(GraphQLObj, {id: JsonAPIObj.id()}, JsonAPIObj.attributes())
}

function FetchJsonAPIFromGraphQL(type, GraphQL){

}

function UpdateJsonAPIFromGraphQL(type, GraphQLObj) {
    return new Promise(function (resolve, reject) {
        api.resource(type).find(GraphQLObj.id).then(function () {
            instance.update(_.omit(GraphQLObj, 'id')).then(function (instance) {
                resolve(JsonAPIToGraphQL(instance))
            }).catch(reject)
        }).catch(reject);
    })
}

api.resource('organizations').index().then(function (organizations) {
    organizations.first().related('brandfolders').then(function (brandfolders) {
        brandfolders.create('brandfolders', {name: 'test-brandfolder'}).then(function (brandfolder) {
            brandfolder.update({name: 'test-again-brandfolder'});
            brandfolder.related('sections').then(function (sections) {
                sections.create('sections', {
                    name: 'my test section',
                    default_asset_type: 'GenericFile'
                }).then(function (section) {
                    section.update({name: 'lovely test section'});
                    section.related('assets').then(function (assets) {
                        for (var i = 0; i < 15; i++) {
                            (function () {
                                var count = i + 1;
                                assets.create('assets', {name: `my test asset ${count}`}).then(function (asset) {
                                    asset.update({name: `lovely test asset ${count}`});
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
