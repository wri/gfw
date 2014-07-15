/**
 * Unit test coverage for CacheService.
 */
define([
  'services/CacheService',
  'moment'
], function(service, moment) {

  'use strict';

  describe('CacheService Suite', function() {

    beforeEach(function() {
      // NOP
    });

    /**
     * Spec for testing _parseTTL().
     */
    describe('_parseTTL()', function() {

      beforeEach(function() {
        // NOP
      });

      it('correctly parses undefined TTL', function() {
        expect(service._parseTTL(undefined)).toEqual({});
      });

      it('correctly parses valid TTL string', function() {
        var ttl = service._parseTTL('5:minutes');

        expect(ttl).toEqual({number: 5, unit: 'minutes'});
      });
     
     it('correctly parses TTL string with invalid number', function() {
        var ttl = service._parseTTL('foo:minutes');

        expect(ttl).toEqual({number: undefined, unit: 'minutes'});
      });      
    });
  });
});
