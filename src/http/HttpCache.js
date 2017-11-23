'use strict';

const moment = require('moment');
const log = require('winston');

class HttpCache {
    constructor(cache) {
        this.cache = cache;
    }

    generateKey(resource, options) {
        const crypto = require('crypto');
        const data = `${resource}${JSON.stringify(options)}`;

        return crypto.createHash('sha1').update(data, 'binary').digest('hex');
    }

    extractDurationsFromCacheControl(cacheControl) {
        const durations = {};

        if (!cacheControl) {
            log.debug('HttpCache: No cache-control');
            return null;
        }

        const match = cacheControl.match(/max-age=([0-9]+)(,? ?stale-while-revalidate=([0-9]+))?(,? ?stale-if-error=([0-9]+))?/i);

        if (match[1]) { // max-age
            durations.maxAge = parseInt(match[1]);
            if (match[3]) { // stale-while-revalidate
                durations.revalidate = parseInt(match[3]);
            }
            if (match[5]) { // stale-if-error
                durations.ifError = parseInt(match[5]);
            }
            log.debug('HttpCache: cache durations extracted from cache-control: ', {
                maxAge: durations.maxAge,
                revalidate: durations.revalidate,
                ifError: durations.ifError
            });
        }

        return durations;
    }

    set(resource, options, response) {
        return new Promise((resolve, reject) => {
            const key = this.generateKey(resource, options);
            const data = {};

            data.body = response.body;
            data.headers = response.headers;
            data.createdAt = moment.now();
            data.durations = this.extractDurationsFromCacheControl(response.headers['cache-control']) || {};

            this.cache.set(key, data, err => {
                if (err) return reject(err);
                log.debug('HttpCache: cache set', { resource });
                resolve();
            });
        });
    }

    calculateFlags(data) {
        let flags = {};
        const now = moment.now();
        const durations = data.durations;
        const createdAt = data.createdAt;

        if (data.durations.maxAge) {
            const maxAgeMoment = moment(createdAt).add(durations.maxAge, 'seconds');
            if (moment(now).isBefore(maxAgeMoment)) {
                flags.valid = true;
            }
            if (!flags.valid && durations.revalidate) {
                const reValidateMoment = moment(createdAt).add(durations.maxAge, 'seconds').add(durations.revalidate, 'seconds');
                if (moment(now).isBetween(maxAgeMoment, reValidateMoment)) {
                    flags.revalidate = true;
                }
            }
            if (!flags.valid && durations.ifError) {
                const ifErrorMoment = moment(createdAt).add(durations.maxAge, 'seconds').add(durations.ifError, 'seconds');
                if (moment(now).isBetween(maxAgeMoment, ifErrorMoment)) {
                    flags.ifError = true;
                }
            }
        }

        return flags;
    }

    get(resource, options) {
        return new Promise((resolve, reject) => {
            this.cache.get(
                this.generateKey(resource, options),
                (err, data) => {
                    if (err) return reject(err);
                    if (!data) {
                        log.debug('HttpCache: get cold cache:', { resource });
                        return resolve(data);
                    }

                    data.flags = this.calculateFlags(data);
                    log.debug('HttpCache: get warm cache:', { resource }, { state: JSON.stringify(data.flags) });
                    resolve(data);
                }
            );
        });
    }
}

module.exports = HttpCache;
