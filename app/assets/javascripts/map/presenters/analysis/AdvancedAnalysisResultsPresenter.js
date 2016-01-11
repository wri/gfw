define([
  'map/presenters/PresenterClass',
  'underscore',
  'backbone',
  'mps',
], function(PresenterClass, _, Backbone, mps) {

  'use strict';

  var AdvancedAnalysisResultsPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    _subscriptions: [{
      'AnalysisService/results': function(results) {
        if (results.failure !== undefined) {
          return this.view._renderFailure();
        }

        if (results.meta.id === 'loss-by-type') {
          this.view._renderResults(results);
        }
      }
    }],

    requestAnalysis: function() {
      var resource = _.omit(this.view.resource, 'thresh'),
          resource = _.extend(resource,
            {dataset: 'loss-by-type', aggregate_by: 'type'});

      mps.publish('AnalysisService/get', [resource]);
    }

  });

  return AdvancedAnalysisResultsPresenter;

});
