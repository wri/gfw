define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  var UMDLossLayerPresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('Timeline/change', _.bind(function(name, dates) {
        if (name === 'loss') {
          this.view.setTimelineDate(dates);
          this.view.updateTiles();
        }
      }, this));      
    }

  });

  return UMDLossLayerPresenter;

});