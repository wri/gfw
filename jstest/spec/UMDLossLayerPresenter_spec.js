/**
 * Unit tests for the UMDLossLayerPresenter class.
 */
define([
  'map/presenters/UMDLossLayerPresenter',
  'mps',
  'underscore'
], function(UMDLossLayerPresenter, mps, _) {

  describe('UMDLossLayerPresenter', function() {
    // The view mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    beforeEach(function() {
      viewSpy = {
        getName: function() {
          return 'loss';
        },
        setCurrentDate: function(dates) {
        },
        updateTiles: function() {
        }
      };
      spyOn(viewSpy, 'getName').and.callThrough();
      spyOn(viewSpy, 'setCurrentDate');
      presenter = new UMDLossLayerPresenter(viewSpy);
    });

    it('Check Timeline/change event handling', function() {
      mps.publish('Timeline/date-change', ['loss', [2001, 2002]]);

      expect(viewSpy.setCurrentDate).toHaveBeenCalled();
      expect(viewSpy.setCurrentDate).toHaveBeenCalledWith([2001, 2002]);
      expect(viewSpy.setCurrentDate.calls.count()).toEqual(1);

      expect(viewSpy.getName).toHaveBeenCalled();
      expect(viewSpy.getName.calls.count()).toEqual(1);
    });
  });
});
