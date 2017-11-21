'use strict';

const Cacheman = require('cacheman');
const HttpCache = require('../../../http/HttpCache');
const config = require('config');

exports = module.exports = engine => {
    const name = config.get('httpCache.name');
    const ttl = config.get('httpCache.ttl');
    const cache = new Cacheman(name, {
        engine,
        Promise,
        ttl
    });

    return new HttpCache(cache);
};

exports['@singleton'] = true;
exports['@require'] = ['cacheFileEngine'];
