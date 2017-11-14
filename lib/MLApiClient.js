'use strict';

class MLApiClient {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    getResource(path, ids, options = {}) {
        const headers = {};
        const qs = {};

        ids = Array.isArray(ids) && ids || [ids];

        if (options.ETag) {
            headers['If-None-Match'] = options.ETag;
        }

        qs.ids = ids.join(',');

        this.httpClient({
            url: path,
            headers,
            qs
        }).then(response => {
            console.log(response.body);
            console.log(response.statusCode);
            console.log(response.headers['cache-control']);
        }).catch(err => {
            console.log('Error: ', err);
        });
    }
}

module.exports = MLApiClient;
