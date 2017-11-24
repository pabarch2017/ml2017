/* global describe, it, before, beforeEach */
'use strict';

const chai = require('chai');
const chaiPromised = require('chai-as-promised');
const sinon = require('sinon');
const moment = require('moment');
const should = chai.should();

const HttpCache = require('../../../src/http/HttpCache');

chai.use(chaiPromised);

describe('HttpCache', () => {
    describe('#generateKey()', () => {
        it('should return sha1 "fa0fe346cc9369fc6b0d4964aeaa731263ffc2af"', () => {
            const cache = new HttpCache();

            cache.generateKey('/resource', { opt: 1 }).should.equal('fa0fe346cc9369fc6b0d4964aeaa731263ffc2af');
        });
    });

    describe('#extractDurationsFromCacheControl()', () => {
        let cache = null;

        beforeEach(() => {
            cache = new HttpCache();
        });

        it('should return null', () => {
            should.not.exist(cache.extractDurationsFromCacheControl(undefined));
        });

        it('should return only "maxAge" property', () => {
            cache.extractDurationsFromCacheControl('public max-age=86400, other').should.deep.equal({ maxAge: 86400 });
        });

        it('should return "maxAge" and "revalidate" properties', () => {
            cache.extractDurationsFromCacheControl('public max-age=86400,stale-while-revalidate=1000')
                .should.deep.equal({ maxAge: 86400, revalidate: 1000 });
        });

        it('should return "maxAge", "revalidate" and ifError properties', () => {
            cache.extractDurationsFromCacheControl('public max-age=86400, stale-while-revalidate=1000,stale-if-error=500')
                .should.deep.equal({ maxAge: 86400, revalidate: 1000, ifError: 500 });
        });
    });

    describe('#calculateFlags()', () => {
        let cache = null;

        beforeEach(() => {
            cache = new HttpCache();
        });

        it('should return empty object when no flags are set', () => {
            const data = {
                createdAt: moment(),
                durations: {}
            };

            cache.calculateFlags(data).should.deep.equal({});
        });

        it('should set flag "valid" when "max-age" is valid', () => {
            const data = {
                createdAt: moment().subtract(5, 'minutes'),
                durations: {
                    maxAge: 600
                }
            };

            cache.calculateFlags(data).should.deep.equal({ valid: true });
        });

        it('should set flag "revalidate" when "stale-while-revalidate" is valid', () => {
            const data = {
                createdAt: moment().subtract(2, 'minutes'),
                durations: {
                    maxAge: 60,
                    revalidate: 120
                }
            };

            cache.calculateFlags(data).should.deep.equal({ revalidate: true });
        });

        it('should set flag "ifError" when "stale-if-error" is valid', () => {
            const data = {
                createdAt: moment().subtract(2, 'minutes'),
                durations: {
                    maxAge: 60,
                    ifError: 120
                }
            };

            cache.calculateFlags(data).should.deep.equal({ ifError: true });
        });
    });

    describe('#set()', () => {
        let cache = null;
        let httpCache = null;

        before(() => {
            sinon.stub(require('moment'), 'now').returns(1000);
        });

        beforeEach(() => {
            cache = {};
            cache.set = sinon.stub();
            httpCache = new HttpCache(cache);
            sinon.stub(httpCache, 'generateKey');
            sinon.stub(httpCache, 'extractDurationsFromCacheControl');
        });

        it('should reject if an errors occurs setting the cache', () => {
            cache.set.callsArgWith(2, new Error());

            return httpCache.set('/r1', {}, {}).should.be.rejected;
        });

        it('should successfully set data into the cache', () => {
            const resource = '/r1';
            const options = { attributes: 'val1' };
            const response = {
                body: 'text',
                headers: {
                    'cache-control': 'public, max-age: 3600'
                }
            };

            httpCache.generateKey.withArgs(resource, options).returns('key1');
            httpCache.extractDurationsFromCacheControl.withArgs(response.headers['cache-control']).returns({ maxAge: 3600 });

            cache.set.withArgs('key1', {
                body: response.body,
                headers: response.headers,
                createdAt: 1000,
                durations: { maxAge: 3600 }
            }).callsArgWith(2, undefined);

            return httpCache.set(resource, options, response).should.eventually.deep.equal(undefined);
        });
    });

    describe('#get', () => {
        let cache = null;
        let httpCache = null;

        beforeEach(() => {
            cache = {};
            cache.get = sinon.stub();
            httpCache = new HttpCache(cache);
            sinon.stub(httpCache, 'generateKey');
            sinon.stub(httpCache, 'calculateFlags');
        });

        it('should reject if an errors occurs getting cached data', () => {
            cache.get.callsArgWith(2, new Error());

            return httpCache.get('/r1', {}).should.be.rejected;
        });

        it('should return null from cache', () => {
            const resource = '/r1';
            const options = { option: 1 };

            httpCache.generateKey.withArgs(resource, options).returns('key1');

            cache.get.withArgs('key1').callsArgWith(1, undefined, null);

            return httpCache.get(resource, options).should.eventually.equal(null);
        });

        it('should return cached data', () => {
            const resource = '/r1';
            const options = { option: 1 };
            const data = { data: 2 };

            httpCache.generateKey.withArgs(resource, options).returns('key1');
            httpCache.calculateFlags.withArgs(data).returns({ valid: true });

            cache.get.withArgs('key1').callsArgWith(1, undefined, data);

            return httpCache.get(resource, options).should.eventually.deep.equal({ data: 2, flags: { valid: true }});
        });
    });
});
