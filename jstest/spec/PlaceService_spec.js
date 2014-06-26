/**
 * Unit test coverage for PlaceService.
 */
define([
  'services/PlaceService'
], function(PlaceService) {

  describe("The PlaceService", function() {
    var params = null;
    var name = 'map';
    var service = null;

    beforeEach(function() {
      params = {
        zoom: 8,
        lat: 1.1,
        lng: 2,
        iso: 'idn',
        maptype: 'terrain',
        baselayers: 'loss',
        sublayers: '1,2,3',
        begin: 2014,
        end: 3014
      };
    });
  
    describe("Test place getter functions", function() {
      // Mock MapLayerService
      var mapLayerService = null;
      var layersResult = null;
      var callback = null;
    
      beforeEach(function() {  
        // The mock MapLayerService
        mapLayerService = {
          getLayers: function(where, successCb, errorCb) {
            callback('layers');
          }
        };
        spyOn(mapLayerService, 'getLayers').and.callThrough();
        
        // Callback for getMapLayers()
        callback = function(layers) {
          layersResult = layers;
        };

        // The PlaceService with mocked in MapLayerService
        service = new PlaceService('map', params, mapLayerService);
      });

      it("Place values are correct", function() {        
        service.getMapLayers(callback);
        expect(mapLayerService.getLayers).toHaveBeenCalled();
        expect(layersResult).toEqual('layers');
        expect(service.getMapZoom()).toEqual(8);
        expect(service.getMapCenter()).toEqual({lat: 1.1, lng: 2});
        expect(service.getIso()).toEqual('idn');
        expect(service.getMapTypeId()).toEqual('terrain');
        expect(service.getBeginDate()).toEqual(2014);
        expect(service.getEndDate()).toEqual(3014);
      });
    });
  });
});