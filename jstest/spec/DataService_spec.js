/**
 * Unit test coverage for DataService.
 */
define([
  'map/services/DataService',
], function(service) {

  /* global describe, it, expect */

  'use strict';

  describe('DataService', function() {

    describe('_getDuration()', function() {
      it('correctly returns milliseconds of a day', function() {
        expect(service._getDuration(1, 'days')).toEqual(86400000);
      });
    });

    describe('define() + request()', function() {
      it('defined service can be requested', function() {
        var f = function() {
          service.request({resourceId: 'foo'});
        };

        service.define('foo', {url: '/bar'});
        expect(f).not.toThrow();
      });

      it('undefined service throws expection if requested', function() {
        var f = function() {
          service.request({resourceId: 'bar'});
        };
        expect(f).toThrow();
      });
    });
  });
});
