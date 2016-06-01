/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var UMDLossLayerPresenter = PresenterClass.extend({

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
    }

  });

  return UMDLossLayerPresenter;
});
