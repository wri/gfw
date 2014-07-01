/**
 * Unit tests for the AnalysisButtonPresenter class.
 */
define([
  'presenters/AnalysisButtonPresenter',
  'mps',
  'underscore'
], function(AnalysisButtonPresenter, mps, _) {

  describe("The AnalysisButtonPresenter", function() {
    // The view mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    beforeEach(function() {
      viewSpy = {
        setEnabled: function(enabled) {
        },
        isEnabled: function() {
        }
      };
      presenter = new AnalysisButtonPresenter(viewSpy);
    });

    describe("Test AnalysisButton/setEnabled event", function() {

      beforeEach(function() {
        spyOn(viewSpy, 'setEnabled');
      });

      it("Check view enabled", function() {
        mps.publish('AnalysisButton/setEnabled', [true]);
        expect(viewSpy.setEnabled).toHaveBeenCalled();
        expect(viewSpy.setEnabled.calls.count()).toEqual(1);
        expect(viewSpy.setEnabled.calls.argsFor(0)).toEqual([true]);
      });

      it("Check view disabled", function() {
        mps.publish('AnalysisButton/setEnabled', [false]);
        expect(viewSpy.setEnabled).toHaveBeenCalled();
        expect(viewSpy.setEnabled.calls.count()).toEqual(1);
        expect(viewSpy.setEnabled.calls.argsFor(0)).toEqual([false]);
      });
    });


    describe("Test onClick event from view", function() {
      var callbackSpy = null;

      beforeEach(function() {
        callbackSpy = {
          callback: function(data) {
          }
        };
        spyOn(callbackSpy, 'callback');
        mps.subscribe('AnalysisButton/clicked', callbackSpy.callback);

        // Simulates the view calling onClick
        presenter.onClick();
      });

      it("Test AnalysisButton/clicked event was published", function() {
        expect(callbackSpy.callback).toHaveBeenCalled();
        expect(callbackSpy.callback.calls.count()).toEqual(1);
        expect(callbackSpy.callback.calls.argsFor(0)).toEqual([]);
      });
    });
  });
});
