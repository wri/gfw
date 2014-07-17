/**
 * The AnalysisButtonPresenter class for the AnalysisButtonView.
 *
 * @return AnalysisButtonPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisButtonPresenter = Class.extend({

    /**
     * Constructs new AnalysisButtonPresenter.
     *
     * @param  {AnalysisButtonView} view Instance of AnalysisButtonView
     *
     * @return {class} The AnalysisButtonPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('AnalysisButton/setEnabled', _.bind(function(enabled) {
        this.view.setEnabled(enabled);
      }, this));
      mps.subscribe('AnalysisService/results', function(results) {console.log(results)});
    },

    /**
     * Handles an onClick UI event from the view by publishing a new
     * 'AnalysisButton/clicked'.
     */
    onClick: function() {
        mps.publish('AnalysisButton/clicked', _.bind(function() {
      }, this));
        this.view.showHelperBar();
    },
    requestAnalysis: function(the_geom) {
      //mps.publish('AnalysisService/get', [{dataset: 'umd-loss-gain', iso: 'idn'}]);
      mps.publish('AnalysisService/get', [{dataset: 'imazon-alerts', geojson: the_geom}]);
    }
  });

  return AnalysisButtonPresenter;

});
