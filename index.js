'use strict';

const config = require('config');
const request = require('request-promise-native');

const MLApiClient = require('./lib/MLApiClient');

const httpClient = request.defaults({
    baseUrl: config.get('api.baseUrl'),
    forever: true,
    json: true,
    timeout: 5000,
    gzip: true,
    simple: false,
    resolveWithFullResponse: true
});


const apiClient = new MLApiClient(httpClient);

//apiClient.getResource('/items', 'MLA619067400', { 'ETag': '7aa0fec78e43e91427c29a00facb6026'})

const Cacheman = require('cacheman');
const CachemanFile = require('cacheman-file');

const cacheOtions = {
    ttl: 20,
    engine: new CachemanFile({}),
    Promise: Promise
};

const cache = new Cacheman('todo', cacheOtions);

cache.get('hola')
.then(val => {
    console.log(val);
})

cache.set('hola', 'chau')
.then(val => {
    console.log(val);
})
