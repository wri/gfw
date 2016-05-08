/**
 * The LandsatAlerts layer presenter.
 *
 * @return LandsatAlertsLayerPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var LandsatAlertsLayerPresenter = PresenterClass.extend({

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
    }]
  });

  return LandsatAlertsLayerPresenter;
});
