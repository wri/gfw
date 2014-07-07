/**
 * The Timeline view presenter.
 *
 * @return TimelinePresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var TimelinePresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function() {
        // if (place.name === 'map') {
        // }
      }, this));

      // mps.publish('Place/register', [this]);

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.view.setTimeline(layerSpec);
      }, this));
    }
  });

  return TimelinePresenter;

});
