/**
 * Unit tests for the TimelinePresenter class.
 */
define([
  'underscore',
  'mps',
  'moment',
  'map/presenters/TimelinePresenter',
  'helpers/layerspec',
  'helpers/place_params'
], function(_, mps, moment, Presenter) {

  describe("TimelinePresenter", function() {
    var viewSpy = null;
    var presenter = null;
    layerSpec = _.clone(layerSpec);
    placeParams = _.clone(placeParams);

    placeParams.begin = moment();
    placeParams.end = moment();

    layerSpec.getBaselayers = function() {
      return layerSpec.forest_clearing;
    };

    layerSpec.getLayer = function(where) {
      return _.findWhere(layerSpec.forest_clearing, where);
    }

    beforeEach(function() {
      viewSpy = {
        update: jasmine.createSpy(),
        model: {
          set: jasmine.createSpy()
        }
      };

      presenter = new Presenter(viewSpy);

      presenter._timelineEnabled = jasmine.createSpy();
      presenter._setTimeline(layerSpec, placeParams);
    });

    describe('_setTimeline()', function() {
      it('must set the correct timeline from layerSpec', function() {
        expect(presenter.currentTimeline).toBeDefined();
        expect(presenter.currentTimeline.getName()).toEqual('umd_tree_loss_gain');

        expect(presenter._timelineEnabled).toHaveBeenCalled();

        expect(viewSpy.model.set).toHaveBeenCalled();
        expect(viewSpy.model.set).toHaveBeenCalledWith('hidden', false);
        expect(viewSpy.model.set.calls.count()).toEqual(1);
      });
    });

    describe('_removeTimeline()', function() {
      beforeEach(function() {
        presenter._removeTimeline();
      });

      it('must remove timeline', function() {
        expect(presenter.currentTimeline).toEqual(null);
      });
    });
  });
});
