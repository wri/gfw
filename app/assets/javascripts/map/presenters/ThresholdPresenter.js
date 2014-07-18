/**
 * The ThresholdPresenter class for the ThresholdView.
 *
 * @return ThresholdPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var ThresholdPresenter = Class.extend({

    /*
     * Toggle threshold with this layers.
     */
    thresholdLayers: [
      'umd_tree_loss_gain',
      'forest2000'
    ],

    /**
     * Constructs new ThresholdPresenter.
     *
     * @param  {ThresholdView} view Instance of ThresholdView
     *
     * @return {class} The ThresholdPresenter class
     */
    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        console.log('place go');
        this._setVisibility(place.params.layerSpec);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setVisibility(layerSpec);
      }, this))
    },

    /**
     * Set the threshold visible or hidden deppend on
     * the active layers.
     *
     * @param {object} layerSpec The layer spec object
     */
    _setVisibility: function(layerSpec) {
      var baselayers = _.intersection(_.pluck(
        layerSpec.getBaselayers(), 'slug'), this.thresholdLayers);

      if (baselayers.length > 0) {
        this.view.model.set('hidden', false);
      } else {
        this.view.model.set('hidden', true);
      }
    },

    changeThreshold: function(threshold) {
      mps.publish('Threshold/changed', [threshold]);
    }

  });

  return ThresholdPresenter;

});
