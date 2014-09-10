define([
  'map/services/CountryService',
  'helpers/api_responses',
], function(service) {

  /* global describe, it, expect, beforeEach, jasmine, spyOn */

  'use strict';

  describe('CountryService Suite', function() {

    it('the service is not null', function() {
      expect(service).not.toEqual(null);
    });

    /**
     * Spec for testing execute().
     */
    describe('execute()', function() {
      var response = null;
      var callback = null;

      // Disable caching and redefine requests
      service._cacheConfig = null;
      service._defineRequests();

      beforeEach(function(done) {
        jasmine.Ajax.install();

        // Mock MapServiceLayer and Router
        callback = {
          success: function(data) {
            response = data;
            done();
          }
        };
        spyOn(callback, 'success').and.callThrough();
        service.execute('bra', callback.success);
        jasmine.Ajax.requests.mostRecent().response({
          'status': 200,
          'responseText': '"boom"'
        });
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it('correctly executes callback with data', function() {
        expect(response).toEqual('boom');
      });
    });
  });
});
