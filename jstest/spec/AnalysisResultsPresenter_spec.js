/**
 * Unit test coverage for AnalysisResultsPresenter.
 */
define([
  'underscore',
  'map/presenters/analysis/AnalysisResultsPresenter',
  '../helpers/analysis_service_response.js',
  '../helpers/layers.js'
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
        renderLoading: jasmine.createSpy(),
        $tab: { addClass: jasmine.createSpy() },
        toggleSubscribeButton: jasmine.createSpy()
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
          baselayer: null,
          both: false,
          analysis: false,
          isoTotalArea: null,
          resource: null
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
      });

      it('should render analysis a valid supplied resource', function() {
        presenter._renderResults(AnalysisServiceResponse.fires);
        expect(presenter._renderAnalysis.calls.count()).toEqual(1);
      });
    });

    describe('deleteAnalysis()', function() {
      beforeEach(function() {
        presenter.deleteAnalysis();
      });

      it('should set status.analysis to false and hide the widget', function() {
        expect(presenter.status.set).toHaveBeenCalledWith('analysis', false);
        expect(presenter.status.set).toHaveBeenCalledWith('iso', null);
        expect(presenter.status.set).toHaveBeenCalledWith('resource', null);
        expect(presenter.status.set.calls.count()).toEqual(3);

        expect(viewSpy.model.set).toHaveBeenCalledWith('boxHidden', true);
        expect(viewSpy.model.set.calls.count()).toEqual(1);
      });
    });
  });

});
