/**
 * Unit test coverage for AnalysisResultsPresenter.
 */
define([
  'underscore',
  'map/presenters/AnalysisResultsPresenter',
  'helpers/analysis_service_response',
  'helpers/layers'
], function(_, Presenter) {
  'use strict';

  describe('AnalysisResultsPresenter', function() {
    var presenter, viewSpy;

    beforeEach(function() {
      viewSpy = {
        model: {
          set: jasmine.createSpy()
        },
        renderAnalysis: jasmine.createSpy(),
        renderFailure: jasmine.createSpy(),
        renderUnavailable: jasmine.createSpy(),
        renderLoading: jasmine.createSpy()
      };

      // Subscribe wont be called and events won't be triggered.
      spyOn(Presenter.prototype, '_subscribe');
      presenter = new Presenter(viewSpy);
      spyOn(presenter.status, 'set');
    });

    describe('Initialization', function() {
      it('subscribe to application events', function() {
        expect(Presenter.prototype._subscribe).toHaveBeenCalled();
      });

      it('presenter.status is defined correctly', function() {
        expect(presenter.status).toBeDefined();
        expect(presenter.status.toJSON()).toEqual({
          layerSpec: null,
          analysis: false,
          isoTotalArea: null
        });
      });
    });

    // Should render the analysis, failure or unavailable message,
    // and set status.analysis to true and model.boxHidden to false.
    describe('_renderResults()', function() {
      beforeEach(function() {
        spyOn(presenter, '_renderAnalysis');
      });

      afterEach(function() {
        expect(presenter.status.set).toHaveBeenCalledWith('analysis', true);
        expect(presenter.status.set.calls.count()).toEqual(1);

        expect(viewSpy.model.set).toHaveBeenCalledWith('boxHidden', false);
        expect(viewSpy.model.set.calls.count()).toEqual(1);
      });

      it('should render analysis a valid supplied resource', function() {
        presenter._renderResults(AnalysisServiceResponse.fires);
        expect(presenter._renderAnalysis.calls.count()).toEqual(1);
      });

      it('should render failure message from a failure response', function() {
        presenter._renderResults({failure: true});
        expect(viewSpy.renderFailure.calls.count()).toEqual(1);
      });

      it('should render unavailable message from a unvalid resource', function() {
        presenter._renderResults({unavailable: true});
        expect(viewSpy.renderUnavailable.calls.count()).toEqual(1);
      });

      it('should render a spinning gif when loading', function() {
        presenter._renderResults({loading: true});
        expect(viewSpy.renderLoading.calls.count()).toEqual(1);
      });
    });

    describe('_renderAnalysis()', function() {
      beforeEach(function() {
        spyOn(presenter, '_getLayerFromDatasetId').and.returnValue(layers.fires);
        presenter._renderAnalysis(AnalysisServiceResponse.fires);
      });

      it('should get the layer object from status.layerSpec', function() {
        expect(presenter._getLayerFromDatasetId).toHaveBeenCalledWith(
          AnalysisServiceResponse.fires.meta.id);
        expect(presenter._getLayerFromDatasetId.calls.count()).toEqual(1);
      });

      it('should call view.renderAnalysis after getting results html params succesfully', function() {
        expect(viewSpy.renderAnalysis.calls.count()).toEqual(1);
      });
    });

    describe('deleteAnalysis()', function() {
      beforeEach(function() {
        presenter.deleteAnalysis();
      });

      it('should set status.analysis to false and hide the widget', function() {
        expect(presenter.status.set).toHaveBeenCalledWith('analysis', false);
        expect(presenter.status.set.calls.count()).toEqual(1);

        expect(viewSpy.model.set).toHaveBeenCalledWith('boxHidden', true);
        expect(viewSpy.model.set.calls.count()).toEqual(1);
      });
    });
  });

});
