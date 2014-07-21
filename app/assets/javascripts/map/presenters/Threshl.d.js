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
        this._setVisibility(place.params.layerSpec);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setVisibility(layerSpec);
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Set the threshold visible or hidden deppend on
     * the active layers.
     *
     * @param {object} layerSpec The layer spec object
     */
    _setVisibility: function(layerSpec) {
      var layers = _.filter(layerSpec.getLayers(), _.bind(function(layer) {
        return _.intersection(this.thresholdLayers, [layer.slug]).length > 0;
      }, this));

      // if layer have threshold, append that value!
      if (layers.length > 0) {
        this.view.model.set('hidden', false);
        this.view.update(layers);
      } else {
        this.view.model.set('hidden', true);
      }
    },

    changeThreshold: function(threshold) {
      mps.publish('Threshold/changed', [threshold]);
      mps.publish('Place/update', [{go: false}]);
    },

    getPlaceParams: function() {
      var params = {};
      var threshold = this.view.getThreshold();
      console.log(threshold);
      if (threshold) {
        params.threshold = threshold;
      }
      return params;
    }
  });

  return ThresholdPresenter;

});
