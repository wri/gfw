/**
 * The Forma 250 (2016) layer presenter.
 *
 * @return FormaLayerPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var FormaMonth3LayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'TorqueTimeline/date-change': function(layerName, date) {
        if (this.view.getName() === layerName) {
          this.view.setDate(date);
          this.view.stop();
        }
      },
      'Timeline/date-range-change': function(layerName, dates) {
        if (this.view.getName() === layerName) {
          this.view.setDateRange(dates);
          this.view.stop();
        }
      },
      'Timeline/toggle-playing': function() {
        this.view.toggle();
      },
      'Timeline/start-playing': function() {
        this.view.start();
      },
      'Timeline/stop-playing': function() {
        this.view.stop();
      }
    }],

    updateLayer: function() {
      mps.publish('Layer/update', [this.view.getName()]);
    },

    animationStarted: function(bounds) {
      mps.publish('Torque/started', [bounds]);
    },

    animationStopped: function() {
      mps.publish('Torque/stopped', []);
    },

    updateTimelineDate: function(change) {
      mps.publish('Torque/date-change', [change]);
    }


  });

  return FormaMonth3LayerPresenter;
});
