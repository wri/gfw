/**
 * Unit test coverage for AnalysisResultsPresenter.
 */
define([
  'underscore',
  'presenters/AnalysisResultsPresenter',
  'helpers/analysis_service_response'
], function(_, Presenter) {
  'use strict';

  describe('AnalysisResultsPresenter', function() {
    var presenter, viewSpy;

    beforeEach(function() {
      viewSpy = {
        model: {
          set: jasmine.createSpy()
        },
        renderFailure: jasmine.createSpy(),
        renderUnavailable: jasmine.createSpy()
      };

      // Subscribe wont be called and events won't be triggered.
      spyOn(Presenter.prototype, '_subscribe');
      presenter = new Presenter(viewSpy);
      spyOn(presenter, '_renderAnalysis');
      spyOn(presenter.status, 'set')
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
          isoTotalArea: null,
          disableUpdating: false
        });
      });
    });

    // Should render the analysis, failure or unavailable message,
    // and set status.analysis to true and model.boxHidden to false.
    describe('_handleAnalysisResults()', function() {
      afterEach(function() {
        expect(presenter.status.set).toHaveBeenCalled();
        expect(presenter.status.set).toHaveBeenCalledWith('analysis', true);
        expect(presenter.status.set.calls.count()).toEqual(1);

        expect(viewSpy.model.set).toHaveBeenCalled();
        expect(viewSpy.model.set).toHaveBeenCalledWith('boxHidden', false);
        expect(viewSpy.model.set.calls.count()).toEqual(1);
      });

      it('should render analysis a valid supplied resource', function() {
        presenter._handleAnalysisResults(AnalysisServiceResponse.fires);
        expect(presenter._renderAnalysis).toHaveBeenCalled();
        expect(presenter._renderAnalysis.calls.count()).toEqual(1);
      });

      it('should render failure message from a failure response', function() {
        presenter._handleAnalysisResults({failure: true});
        expect(viewSpy.renderFailure).toHaveBeenCalled();
        expect(viewSpy.renderFailure.calls.count()).toEqual(1);
      });

      it('should render unavailable message from a unvalid resource', function() {
        presenter._handleAnalysisResults({unavailable: true});
        expect(viewSpy.renderUnavailable).toHaveBeenCalled();
        expect(viewSpy.renderUnavailable.calls.count()).toEqual(1);
      });
    });

    describe('_renderAnalysis()', function() {

    });

    describe('_getAnalysisResource()', function() {

    });

    describe('deleteAnalysis()', function() {

    });
  });

});
