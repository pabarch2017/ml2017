'use strict';

const config = require('config');
const request = require('request-promise-native');

exports = module.exports = () => {
    return request.defaults(config.httpClient);
};

exports['@singleton'] = true;
