'use strict';

module.exports = {
    httpClient: {
        baseUrl: 'https://api.mercadolibre.com',
        forever: true,
        json: true,
        timeout: 5000,
        gzip: true,
        simple: false,
        resolveWithFullResponse: true
    },
    httpCache: {
        ttl: 86400 * 10
    },
    logging: {
        level: 'debug',
        colorize: true,
        timestamp: true
    }
};
