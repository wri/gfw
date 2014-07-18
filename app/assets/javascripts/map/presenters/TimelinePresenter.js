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
      mps.subscribe('Place/go', _.bind(function(place) {
        this.view.setTimeline(place.params.layerSpec.getBaselayers());
        if (!place.params.date) {
          mps.publish('Place/update', [{go: false}]);
        }
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.view.setTimeline(layerSpec.getBaselayers());
      }, this));
    }
  });

  return TimelinePresenter;

});
