'use strict';

const ApiClient = require('../../ApiClient');

exports = module.exports = (httpClient, httpCache) => {
    return new ApiClient(httpClient, httpCache);
};

exports['@singleton'] = true;
exports['@require'] = ['httpClient', 'httpCache'];
