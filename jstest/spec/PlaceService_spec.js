/**
 * Unit test coverage for PlaceService.
 */
define([
  'services/PlaceService',
  'mps',
  'nsa'
], function(PlaceService, mps, nsa  ) {

  describe("The PlaceService", function() {
    var params = null;
    var name = 'map';
    var service = null;

    beforeEach(function() {
      params = {
        zoom: '8',
        lat: '1.1',
        lng: '2',
        iso: 'idn',
        maptype: 'terrain',
        baselayers: 'loss',
        sublayers: '1,2,3',
        begin: '2014',
        end: '3014'
      };
    });
  
    describe("Test place getter functions", function() {
      // Mock MapLayerService
      var mapLayerService = null;
      var router = null;
      var layersResult = null;
      var placeResult = null;
    
      beforeEach(function(done) {  
        jasmine.Ajax.install();
        nsa.test = true;
        // The mock MapLayerService
        mapLayerService = {
          getLayers: function(where, successCb, errorCb) {
            successCb('layers');
          }
        };
        spyOn(mapLayerService, 'getLayers').and.callThrough();

        router = {
          navigate: function() {            
          }
        };
        spyOn(router, 'navigate');
        
        mps.subscribe('Place/go', function(place) {
          placeResult = place;
          done();
        });

        // The PlaceService with mocked in MapLayerService and router
        service = new PlaceService(mapLayerService, router);

        mps.publish("Place/update", [{name: 'map', params: params}]);

      });

      it("Place values are correct", function() {

        expect(placeResult).not.toBe(null);
        expect(placeResult.params).not.toBe(null);
        expect(placeResult.name).not.toBe(null);
        expect(placeResult.params).toEqual(jasmine.objectContaining({
          layers: 'layers',
          zoom: 8,
          lat: 1.1,
          lng: 2,
          iso: 'idn',
          maptype: 'terrain',
          begin: 2014,
          end: 3014
        }));
      });
    });
  });
});