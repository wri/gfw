/**
 * The Forma layer presenter.
 *
 * @return FormaLayerPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var FormaLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this._super();
      this.view = view;
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Timeline/date-change': function(layerSlug, date) {
        if (this.view.getName() !== layerSlug) {
          return;
        }
        this.view.setTimelineDate(date);
      }
    }],

  });

  return FormaLayerPresenter;
});
