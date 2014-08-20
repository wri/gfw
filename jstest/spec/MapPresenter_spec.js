/**
 * Unit tests for the MapPresenter class.
 */
define([
  'underscore',
  'mps',
  'presenters/MapPresenter',
], function(_, mps, MapPresenter) {

  describe("presenters/MapPresenter", function() {
    var presenter = null;
    var viewSpy = {};

    // Status model is set correctly
    describe("Status model", function() {
      beforeEach(function() {
        presenter = new MapPresenter(viewSpy);
      });

      it('is defined', function() {
        expect(presenter.status).toBeDefined();
      });

      it('correct default values', function() {
        expect(presenter.status.toJSON()).toEqual({threshold: null});
      });
    });

    // describe("Responding to published events", function() {
    //   var layers = {
    //     forest2000: {}
    //   };

    //   var place = {
    //     params: {
    //       name: 'map',
    //       baselayers: 'loss',
    //       zoom: 8,
    //       maptype: 'terrain',
    //       lat: 1,
    //       lng: 2,
    //     },
    //     layerSpec: {
    //       getLayers: function() {
    //         return layers;
    //       },
    //       getBaselayers: function() {}
    //     }
    //   };

    //   beforeEach(function() {
    //     viewSpy = jasmine.createSpyObj('viewSpy', ['setLayers', 'initMap']);
    //     presenter = new MapPresenter(viewSpy);

    //     // viewSpy = jasmine.createSpyObj(
    //     //   'viewSpy',
    //     //   ['setLayers', 'initMap']);
    //     // presenter = new MapPresenter(viewSpy);
    //   });

    //   it("on Place/go", function() {
    //     // mps.publish('Place/go', [place]);
    //     // expect(viewSpy.initMap).toHaveBeenCalled();
    //     // expect(viewSpy.initMap).toHaveBeenCalledWith(place.params);
    //     // expect(viewSpy.initMap.calls.count()).toEqual(1);

    //     // expect(viewSpy.setLayers).toHaveBeenCalled();
    //     // expect(viewSpy.setLayers).toHaveBeenCalledWith(place.params.layerSpec.getLayers());
    //     // expect(viewSpy.setLayers.calls.count()).toEqual(1);
    //   });

    //   it('LayerNav/change', function() {
    //     mps.publish('LayerNav/change', [place.layerSpec]);
    //     expect(presenter._setLayerSpec).toHaveBeenCalled();
    //   })

    // });

  });
});
