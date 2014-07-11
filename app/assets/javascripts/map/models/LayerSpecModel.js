/**
 * The LayerSpecModel model.
 *
 * @return LayerSpecModel (extends Backbone.Model).
 */
define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var LayerSpecModel = Backbone.Model.extend({

    layerOrder: [
      'umd_tree_loss_gain',
      'forestgain',
      'forest2000',
      'forma',
      'imazon',
      'modis',
      'fires'
    ],

    sort: function(layers) {
      var order = [];

      _.each(this.layerOrder, function(layer) {
        if (layers[layer]) {
          order.push(layer);
        }
      });

      _.each(order, function(layer, i) {
        if (layers[layer]) {
          layers[layer].position = i;
        }
      });

      return layers;
    },

    getLayer: function(where) {
      return _.findWhere(this.getLayers(), where, this);
    },

    /**
     * Get all the layers uncategorized.
     * {forest2000: {}, gain:{}, ...}
     *
     * @return {object} layers
     */
    getLayers: function() {
      var layers = {};

      _.each(this.toJSON(), function(category) {
        _.extend(layers, category);
      });

      return this.sort(layers);
    },

    /**
     * Return baselayers object.
     *
     * @return {object} baselayers
     */
    getBaselayers: function() {
      return this.sort(this.get('forest_clearing') || {});
    },

    /**
     * Return sublayers object.
     *
     * @return {object} sublayers
     */
    getSublayers: function() {
      var layers = {};

      _.each(_.omit(this.toJSON(), 'forest_clearing'),
        function(layers) {
          layers = _.extend(layers, layers);
        });

      return this.sort(layers);
    }
  });

  return LayerSpecModel;

});
