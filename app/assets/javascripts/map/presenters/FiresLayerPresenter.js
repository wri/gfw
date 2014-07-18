/**
 * The FiresLayerPresenter.
 *
 * @return FiresLayerPresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var FiresLayerPresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
        if (this.view.getName() === layerSlug) {
          this.view.setTimelineDate(date);
          this.view.updateTiles();
        }
      }, this));
    }
  });

  return FiresLayerPresenter;

});
