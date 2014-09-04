/**
 * Unit test coverage for MapLayerService.
 */
define([
  'map/services/MapLayerService'
], function(service) {

  /* global describe, it, expect, beforeEach, jasmine, spyOn */

  'use strict';

  // describe('The MapLayerService', function() {

  //   describe('Test getLayers()', function() {
  //     var data, callback;

  //     beforeEach(function(done) {
  //       jasmine.Ajax.install();
  //       // Disable caching and redefine requests
  //       service._cacheConfig = null;
  //       service._defineRequests();

  //       callback = {
  //         success: function(results) {
  //           console.log(String(results));
  //           data = results;
  //           done();
  //         }
  //       };

  //       spyOn(callback, 'success').and.callThrough();
  //       service.getLayers([{id: 581}, {slug: 'forest2000'}], callback.success);
  //       jasmine.Ajax.requests.mostRecent().response({
  //         'status': 200,
  //         'responseText': '"boom"'
  //       });
  //     });

  //     afterEach(function() {
  //       jasmine.Ajax.uninstall();
  //     });

  //     it("Called success callback with correct layer", function() {
  //       expect(data).toEqual('boom');
  //     });
  //   });
  // });
});
