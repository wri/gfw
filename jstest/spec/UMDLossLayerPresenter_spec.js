/**
 * Unit tests for the UMDLossLayerPresenter class.
 */
define([
  'presenters/UMDLossLayerPresenter',
  'mps',
  'underscore'
], function(UMDLossLayerPresenter, mps, _) {

  describe("presenters/UMDLossLayerPresenter", function() {
    // The view mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    beforeEach(function() {
      viewSpy = {
        getName: function() {
          return 'loss';
        },
        setTimelineDate: function(dates) {
        },
        updateTiles: function() {
        }
      };
      spyOn(viewSpy, 'getName').and.callThrough();
      spyOn(viewSpy, 'setTimelineDate');
      spyOn(viewSpy, 'updateTiles');
      presenter = new UMDLossLayerPresenter(viewSpy);
    });

    it("Check Timeline/change event handling", function() {
      mps.publish('Timeline/date-change', ['loss', [2001, 2002]]);

      expect(viewSpy.setTimelineDate).toHaveBeenCalled();
      expect(viewSpy.setTimelineDate).toHaveBeenCalledWith([2001, 2002]);
      expect(viewSpy.setTimelineDate.calls.count()).toEqual(1);

      expect(viewSpy.getName).toHaveBeenCalled();
      expect(viewSpy.getName.calls.count()).toEqual(1);

      expect(viewSpy.updateTiles).toHaveBeenCalled();
      expect(viewSpy.updateTiles.calls.count()).toEqual(1);
    });
  });
});
