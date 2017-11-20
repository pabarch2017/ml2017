'use strict';

module.exports = {
    httpClient: {
        baseUrl: 'https://api.mercadolibre.com',
        forever: true,
        json: true,
        timeout: 10000,
        gzip: true,
        simple: false,
        resolveWithFullResponse: true
    },
    httpCache: {
        name: 'http',
        ttl: 86400 * 10
    },
    logging: {
        level: 'debug',
        colorize: true,
        timestamp: true
    }
};
