'use strict';

const log = require('winston');

class ApiClient {
    constructor(httpClient, httpCache) {
        this.httpClient = httpClient;
        this.httpCache = httpCache;
    }

    getResource(resource, options = {}) {
        const headers = {};
        const queryString = {};

        return this.httpCache.get(resource, options)
            .then(cache => {
                if (cache.flags.valid) {
                    log.debug('ApiClient: response from http cache');
                    return cache.body;
                }

                if (cache.headers && cache.headers['etag']) {
                    headers['If-None-Match'] = cache.headers['etag'];
                    log.debug('ApiClient: setting ETag header', { ETag: cache.headers['etag'] });
                }

                if (options.attributes) {
                    queryString.attributes = options.attributes.join(',');
                    log.debug('ApiClient: set query string:', { attributes: queryString.attributes });
                }

                if (options.ids) {
                    queryString.ids = options.ids.join(',');
                    log.debug('ApiClient: set query string', { ids: queryString.ids });
                }

                log.debug('ApiClient: initiating request...');
                const newResponse = this.httpClient({
                    url: resource,
                    headers,
                    qs: queryString
                }).then(response => {
                    log.debug('ApiClient: response received');
                    if (response.statusCode === 200 || response.statusCode === 304) {
                        let debugText = 'status code 200 (OK)';

                        if (response.statusCode === 304) {
                            response.body = cache.body;
                            debugText = 'status code 304 (Not Modified)';
                        }

                        log.debug(`ApiClient: ${debugText}`);
                        this.httpCache.set(resource, options, response);
                        return response.body;
                    }
                    else {
                        if (cache.flags.ifError) {
                            log.debug('ApiClient: serving response from http cache (if-error)');
                            return cache.body;
                        }

                        if (!cache.flags.revalidate) {
                            throw new Error('ApiClient', { statusCode: response.statusCode, body: JSON.stringify(response.body) });
                        }
                    }
                });

                if (cache.flags.revalidate) {
                    log.debug('ApiClient: response from http cache (while-revalidate)');
                    return cache.body;
                }

                return newResponse;
            });
    }
}

module.exports = ApiClient;
