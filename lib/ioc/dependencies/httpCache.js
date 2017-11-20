'use strict';

const Cacheman = require('cacheman');
const HttpCache = require('../../HttpCache');
const config = require('config');

exports = module.exports = engine => {
    const cache = new Cacheman('http', {
        engine,
        Promise
    });
    const options = {
        ttl: config.get('httpCache.ttl')
    };

    return new HttpCache(cache, options);
};

exports['@singleton'] = true;
exports['@require'] = ['cacheFileEngine'];
