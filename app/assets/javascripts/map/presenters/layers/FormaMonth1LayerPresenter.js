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

  var FormaMonth1LayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Timeline/date-change': function(layerSlug, date) {
        if (this.view.getName() !== layerSlug) {
          return;
        }
        this.view.setCurrentDate(date);
      }
    }, {
      'Threshold/update': function(threshold) {
        this.view.setThreshold(threshold);
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

  return FormaMonth1LayerPresenter;
});
