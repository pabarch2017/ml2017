'use strict';

const config = require('config');
const request = require('request-promise-native');

const httpClient = request.defaults({
    baseUrl: config.get('api.baseUrl'),
    forever: true,
    json: true,
    timeout: 5000,
    gzip: true
});


httpClient({
    url: '/items/MLA619067400'
}).then(response => {
   console.log(response);
}).catch(err => {
    console.log('Error: ', err);
});
