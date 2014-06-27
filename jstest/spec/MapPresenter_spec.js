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
          lng: 2,
          layers: ['layers']
        }
      };
      
      beforeEach(function() {
        viewSpy = jasmine.createSpyObj(
          'viewSpy',
          ['initLayers', 'initMap']);
        presenter = new MapPresenter(viewSpy);  
        mps.publish('Place/go', [place]);        
      });

      it("Check Place/go handling", function() {
        expect(viewSpy.initMap).toHaveBeenCalled();
        expect(viewSpy.initMap).toHaveBeenCalledWith(place.params);
        expect(viewSpy.initMap.calls.count()).toEqual(1);

        expect(viewSpy.initLayers).toHaveBeenCalled();
        expect(viewSpy.initLayers).toHaveBeenCalledWith(place.params.layers);        
        expect(viewSpy.initLayers.calls.count()).toEqual(1);

      });
    });
  });
});