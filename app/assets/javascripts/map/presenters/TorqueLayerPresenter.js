/**
 * The Torque Layer view presenter.
 *
 * @return TorqueLayerPresenter class
 */
define([
  'underscore', 'mps', 'backbone',
  'map/presenters/PresenterClass'
], function(_, mps, Backbone, PresenterClass, layersHelper) {

  'use strict';

  var TorqueLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    _subscriptions: [{
      'Timeline/date-change': function(change) {
      },
      'Timeline/toggle-playing': function() {
        this.view.toggle();
      },
      'Timeline/start-playing': function() {
        this.view.start();
      },
      'Timeline/stop-playing': function() {
        this.view.stop();
      },
    }],

    animationStarted: function(bounds) {
      mps.publish('Torque/started', [bounds]);
    },

    updateTimelineDate: function(change) {
      mps.publish('Torque/date-change', [change]);
    }

  });

  return TorqueLayerPresenter;

});
