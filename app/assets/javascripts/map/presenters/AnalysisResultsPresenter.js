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


    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function(results) {
        this.view.renderAnalysis(results);
      }, this));

      mps.publish('Place/register', [this]);
    },

    getPlaceParams: function() {
      var params = {};
      return params;
    },

    deleteAnalysis: function() {
      mps.publish('AnalysisResults/delete-analysis', []);
    }

  });

  return AnalysisResultsPresenter;

});
