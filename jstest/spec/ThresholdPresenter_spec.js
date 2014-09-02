/**
 * Unit tests for the ThresholdPresenter class.
 */
define([
  'underscore',
  'presenters/ThresholdPresenter',
  'helpers/layers'
], function(_, Presenter) {

  describe('ThresholdPresenter', function() {
    var presenter, viewSpy;

    beforeEach(function() {
      viewSpy = {
        update: jasmine.createSpy(),
        model: {
          set: jasmine.createSpy()
        }
      };

      spyOn(Presenter.prototype, '_subscribe');
      presenter = new Presenter(viewSpy);
    });

    /**
     * Test ThresholdPresenter Initialization
     */
    describe('Initialization', function() {
      it('subscribe to application events', function() {
        expect(Presenter.prototype._subscribe).toHaveBeenCalled();
      });

      it('presenter.status is defined', function() {
        expect(presenter.status).toBeDefined();
      });

      it('presenter.status has correct default attributes', function() {
        expect(presenter.status.toJSON()).toEqual({
          layers: [],
          threshold: 10
        });
      });
    });

    describe("_initThreshold(): Triggered by 'Place/Go'", function() {
      beforeEach(function(){
        var placeParams = {
          threshold: 40
        };
        presenter._initThreshold(placeParams);
      });

      it('Initialize threshold wigdet correctly', function() {
        expect(presenter.view.update).toHaveBeenCalled();
        expect(presenter.view.update).toHaveBeenCalledWith(40);
      });
    });

    describe("_setLayers(): Triggered by 'Place/go' and 'Place/update'", function() {
      beforeEach(function() {
        presenter._setLayers(layers);
      });

      it('correctly set status.layers with the current supported threshold layers', function() {
        expect(presenter.status.get('layers')).toEqual(["umd_tree_loss_gain", "forest2000"]);
      });

      it('correctly set threshold widget hidden attribute when status.layers changes', function() {
        expect(viewSpy.model.set).toHaveBeenCalled();
        expect(viewSpy.model.set).toHaveBeenCalledWith('hidden', false);
      });
    });

  });
});
