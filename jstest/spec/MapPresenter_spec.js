/**
 * Unit tests for the MapPresenter class.
 */
define([
  'underscore',
  'mps',
  'nsa',
  'presenters/MapPresenter',
  'services/PlaceService'
], function(_, mps, nsa, MapPresenter, PlaceService) {

  describe("The MapPresenter", function() {
    // The MapView mock
    var viewSpy = null;

    var placeService = null;

    // The presenter to test
    var presenter = null;

    describe("Test responding to published events", function() {
      var place = {
        params: {
          name: 'map',
          baselayers: 'loss',
          zoom: 8,
          maptype: 'terrain',
          lat: 1,
          lng: 2,
          layerSpec: {
            getLayers: function() {}
          }
        }
      };

      beforeEach(function() {
        viewSpy = jasmine.createSpyObj(
          'viewSpy',
          ['setLayers', 'initMap']);
        presenter = new MapPresenter(viewSpy);
        mps.publish('Place/go', [place]);
      });

      it("Check Place/go handling", function() {
        expect(viewSpy.initMap).toHaveBeenCalled();
        expect(viewSpy.initMap).toHaveBeenCalledWith(place.params);
        expect(viewSpy.initMap.calls.count()).toEqual(1);

        expect(viewSpy.setLayers).toHaveBeenCalled();
        expect(viewSpy.setLayers).toHaveBeenCalledWith(place.params.layers);
        expect(viewSpy.setLayers.calls.count()).toEqual(1);

      });
    });
  });
});
