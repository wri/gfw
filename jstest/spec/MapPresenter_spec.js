/**
 * Unit tests for the MapPresenter class.
 */
define([
  'presenters/MapPresenter',
  'mps', 
  'underscore',
  'nsa',
  'services/PlaceService'
], function(MapPresenter, mps, _, nsa, PlaceService) {

  describe("The MapPresenter", function() {
    // The MapView mock
    var viewSpy = null;

    var placeService = null;

    // The presenter to test
    var presenter = null;

    
    describe("Test responding to published events", function() {
      var place = {
        name: 'map',
        params: {
          baselayers: 'loss',
          zoom: 8,
          maptype: 'terrain',
          lat: 1,
          lng: 2
        }
      };
      
      beforeEach(function(done) {
        jasmine.Ajax.install();
        nsa.test = true;  
        viewSpy = jasmine.createSpyObj(
          'viewSpy',
          ['initLayers', 'setZoom', 'setCenter', 'setMapTypeId']);
        
        placeService = jasmine.createSpyObj(
          'placeService',
          ['getBeginDate', 'getEndDate', 'getMapZoom', 'getMapCenter', 'getIso',
           'getMapTypeId', 'getMapLayers', 'getName']);
        placeService.getName.and.returnValue('map');
        placeService.getMapZoom.and.returnValue(8);
        placeService.getMapCenter.and.returnValue({lat: 1, lng: 2});
        placeService.getMapTypeId.and.returnValue('terrain');
        placeService.getMapLayers = function(callback) {
          callback('layers');
          done();
        };
        spyOn(placeService, 'getMapLayers').and.callThrough();
        
        presenter = new MapPresenter(viewSpy);  
        mps.publish('Place/go', [placeService]);        
        request = jasmine.Ajax.requests.mostRecent();
        request.response(ApiResponse.layers.success);        
      });

      it("Check Place/go handling", function() {
        var layers = 'layers';

        // Zoom
        expect(viewSpy.setZoom).toHaveBeenCalled();
        expect(viewSpy.setZoom).toHaveBeenCalledWith(8);
        expect(viewSpy.setZoom.calls.count()).toEqual(1);

        // Center
        expect(viewSpy.setCenter).toHaveBeenCalled();
        expect(viewSpy.setCenter).toHaveBeenCalledWith(1, 2);
        expect(viewSpy.setCenter.calls.count()).toEqual(1);

        // Maptype
        expect(viewSpy.setMapTypeId).toHaveBeenCalled();
        expect(viewSpy.setMapTypeId).toHaveBeenCalledWith('terrain');        
        expect(viewSpy.setMapTypeId.calls.count()).toEqual(1);

        // TODO check initLayers
        expect(viewSpy.initLayers).toHaveBeenCalled();
        expect(viewSpy.initLayers).toHaveBeenCalledWith(layers);        
        expect(viewSpy.initLayers.calls.count()).toEqual(1);

      });
    });
  });
});