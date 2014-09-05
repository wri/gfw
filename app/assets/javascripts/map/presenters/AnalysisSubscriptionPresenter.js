/**
 * The AnalysisSubscriptionPresenter.
 *
 * @return AnalysisSubscriptionPresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisSubscriptionPresenter = Class.extend({

    init: function(view) {
      this._super();
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('AnalysisSubscription/new', _.bind(function() {
        this.view.subscribeAlerts();
      }, this));
    }
  });

  return AnalysisSubscriptionPresenter;

});
