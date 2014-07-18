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


  return UMDLossLayerPresenter;

});

Class.prototype.remove = function() {
  if (this._subscriptions) {
    for (var i = 0; i < this._subscriptions.length; i++) {
      mps.unsubscribe(this._subscriptions[i]);
    };
  }
}

Backbone.View.prototype.remove = function() {
  Backbone.View.prototype.remove.apply(this, [arguments]);
}
