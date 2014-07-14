/**
 * Unit test coverage for LayerSpecService.
 */
define([
  'services/LayerSpecService',
  'mps',
  'nsa'
], function(service, mps, nsa) {

  'use strict';

  describe('LayerSpecService suite', function() {

    beforeEach(function() {
      jasmine.Ajax.install();
      nsa.test = true;
    });

    it("is not null", function() {
      expect(service).not.toBe(null);
      expect(service.model).not.toBe(null);
    });

    describe('toggle()', function() {
      var spy = null;
      var request = null;

      beforeEach(function(done) {
        spy = {
          success: function(layer) {
            done();
          },
          error: function(error) {
          }
        };

        spyOn(spy, 'success').and.callThrough();
        // service.toggle([{slug: 'forest2000'}], spy.success, spy.error);
        // request = jasmine.Ajax.requests.mostRecent();
        // expect(request.method).toBe('POST');
      });

      // it('toggle layer', function() {
      //   expect(spy.success).toHaveBeenCalled();
      //   expect(spy.success.calls.count()).toEqual(1);
      // });
    });
  });

});
