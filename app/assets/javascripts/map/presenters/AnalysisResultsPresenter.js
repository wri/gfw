/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisResultsPresenter = Class.extend({

    /**
     * Constructs new AnalysisResultsPresenter.
     *
     * @param  {AnalysisResultsView} view Instance of AnalysisResultsView
     *
     * @return {class} The AnalysisResultsPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        this.view.model.set({'hidden': false});
        switch (results.meta.id) {
          case 'imazon-alerts':
            this.view.printResultsImazon(results);
          break
        }
      }, this));
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisButton/_deleteAnalysis', []);
    }
  });

  return AnalysisResultsPresenter;

});
