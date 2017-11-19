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
    }
};
