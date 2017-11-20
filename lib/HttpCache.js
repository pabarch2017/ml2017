'use strict';

const moment = require('moment');
const log = require('winston');

class HttpCache {
    constructor(cache, ttl = 86400 * 5) {
        this.cache = cache;
        this.ttl = ttl;
    }

    generateKey(resource, options) {
        const crypto = require('crypto');
        const data = `${resource}-${JSON.stringify(options)}`;

        return crypto.createHash('md5').update(data).digest('hex');
    }

    extractDurationsFromCacheControl(cacheControl) {
        const durations = {};

        if (!cacheControl) {
            log.debug('HttpCache: No cache-control');
            return durations;
        }

        const match = cacheControl.match(/max-age=([0-9]+)(, stale-while-revalidate=([0-9]+))?(, stale-if-error=([0-9]+))?/i);

        if (match[1]) { // max-age
            durations.maxAge = match[1];
            if (match[3]) { // stale-while-revalidate
                durations.revalidate = match[3];
            }
            if (match[5]) { // stale-if-error
                durations.ifError = match[5];
            }
            log.debug('HttpCache: cache durations extracted from cache-control: ', {
                maxAge: durations.maxAge,
                revalidate: durations.revalidate,
                ifError: durations.ifError
            });
        }

        return durations;
    }

    calculateFlags(data) {
        const flags = {};
        const now = moment.now();
        const durations = data.durations;
        const createdAt = data.createdAt;

        if (data.durations.maxAge) {
            const maxAgeMoment = moment(createdAt).add(durations.maxAge, 'seconds');
            if (now.isBefore(maxAgeMoment)) {
                flags.valid = true;
            }
            if (!data.valid && durations.revalidate) {
                const reValidateMoment = maxAgeMoment.add(durations.revalidate, 'seconds');
                if (now.isBetween(maxAgeMoment, reValidateMoment)) {
                    flags.revalidate = true;
                }
            }
            if (!data.valid && durations.ifError) {
                const ifErrorMoment = maxAgeMoment.add(durations.ifError, 'seconds');
                if (now.isBetween(maxAgeMoment, ifErrorMoment)) {
                    flags.ifError = true;
                }
            }
        }

        return flags;
    }

    set(resource, options, response) {
        const key = this.generateKey(resource, options);
        const data = {};

        data.body = response.body;
        data.createdAt = moment.now();
        data.durations = this.extractDurationsFromCacheControl(response.headers['cache-control']);
        data.headers = response.headers;

        this.cache.set(key, response, this.ttl, err => {
            if (err) throw err;
            log.debug('HttpCache: cache set', { resource });
        });
    }

    get(resource, options) {
        return new Promise((resolve, reject) => {
            this.cache.get(
                this.generateKey(resource, options),
                (err, data) => {
                    if (err) return reject(err);
                    if (!data) {
                        log.debug('HttpCache: cache empty:', { resource });
                        return resolve({ flags: {} });
                    }

                    data.flags = this.calculateFlags(data);

                    resolve(data);
                }
            );
        });
    }
}

module.exports = HttpCache;
