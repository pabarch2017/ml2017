/* global describe, it, beforeEach */
'use strict';

const should = require('chai').should();

const HttpCache = require('../../lib/http/HttpCache');
const moment = require('moment');

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

    });
});
