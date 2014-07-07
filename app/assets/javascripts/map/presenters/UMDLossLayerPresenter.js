/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var UMDLossLayerPresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        if (this.view.getName() === layerSlug) {
          this.view.setTimelineDate(date);
          this.view.updateTiles();
        }
      }, this));
    }

  });

  return UMDLossLayerPresenter;

});
