/**
 * Unit test coverage for MapLayerService.
 */
define([
  'services/MapLayerService'
], function(service) {

  /* global describe, it, expect, beforeEach, jasmine, spyOn */

  'use strict';

  describe("The MapLayerService", function() {

    describe('Test getLayers()', function() {
      var spy = null;
      var response = null;
    
      beforeEach(function(done) {  
        jasmine.Ajax.install();

        spy = {
          success: function(data) {
            response = data;
            done();
          }
        };      
        spyOn(spy, 'success').and.callThrough();
        service.getLayers([{id: 581}, {slug: 'forest2000'}], spy.success);
        jasmine.Ajax.requests.mostRecent().response({
          'status': 200,
          'responseText': '"boom"'
        });
      });

      it("Called success callback with correct layer", function() {
        expect(response).toEqual([]);
      });
    });
  });
});