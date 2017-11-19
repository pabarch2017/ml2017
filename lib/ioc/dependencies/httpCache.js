'use strict';

const Cacheman = require('cacheman');
const HttpCache = require('../../HttpCache');

exports = module.exports = engine => {
    const cache = new Cacheman('http', {
        engine,
        Promise: Promise
    });

    return HttpCache(cache);
};

exports['@singleton'] = true;
exports['@require'] = ['CacheFileEngine'];
