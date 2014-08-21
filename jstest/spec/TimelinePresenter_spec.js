/**
 * Unit tests for the TimelinePresenter class.
 */
define([
  'underscore',
  'mps',
  'presenters/TimelinePresenter'
], function(_, mps, TimelinePresenter) {

  describe("presenters/TimelinePresenter", function() {
    // The TimelineView mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    describe("Test publishing events", function() {
      var layers = {
        forest_clearing: {}
      };

      var place = {
        params: {
          layerSpec: {
            layers: layers,
            getBaselayers: function() {
              return layers.forest_clearing;
            },
            getLayers: function(){}
          }
        }
      };

      beforeEach(function() {
        // viewSpy = jasmine.createSpyObj(
        //   'viewSpy',
        //   ['setTimeline']);
        // presenter = new TimelinePresenter(viewSpy);
        // mps.publish('Place/go', [place]);
      });

      it("Check Place/go handling", function() {
        // expect(viewSpy.setTimeline).toHaveBeenCalled();
        // expect(viewSpy.setTimeline).toHaveBeenCalledWith(place.params.layerSpec.layers.forest_clearing);
        // expect(viewSpy.setTimeline.calls.count()).toEqual(1);
      });
    });
  });
});
