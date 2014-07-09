/**
 * The LayerSpecService class.
 *
 * @return LayerSpec instance.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/MapLayerService',
  'services/LayerValidatorService'
], function(Class, _, mps, mapLayerService, layerValidatorService) {

  'use strict';

  var LayerSpecService = Class.extend({

    init: function() {
      this.layers = {};
    },

    /**
     * Asynchronously set the LayerSpec object and validates it.
     *
     * @param {array}   where    Array of slugs and ids. [{id: 591}, {slug: 'forest2000'}]
     * @param {callback} success Return valitaded layerSpec instance.
     * @param {callback} error   Return error
     */
    add: function(where, success, error) {
      // LayersSpec doesn't have state?
      this.layers = {};

      mapLayerService.getLayers(
        where,
        _.bind(function(results) {
          var layers = _.clone(this.layers);

          _.each(results, function(layer) {
            layers[layer.category_slug] = layers[layer.category_slug] || {};
            layers[layer.category_slug][layer.slug] = layer;
          });

          if (layerValidatorService.validate(layers)) {
            this.layers = layers;
            success(this);
          } else {
            error(this, 'Error validating');
          }
        }, this),
        function(error) {
          console.error(error);
          callback(undefined);
        });
    },

    /**
     * Return baselayers object.
     *
     * @return {object} baselayers
     */
    getBaselayers: function() {
      return this.layers.forest_clearing || {};
    },

    /**
     * Return sublayers object.
     *
     * @return {object} sublayers
     */
    getSublayers: function() {
      var sublayers = {};

      _.each(_.omit(this.layers, 'forest_clearing'),
        function(layers) {
          sublayers = _.extend(sublayers, layers);
        });

      return sublayers;
    },

    /**
     * Get all the layers uncategorized.
     * {forest2000: {}, gain:{}, ...}
     *
     * @return {object} layers
     */
    getLayers: function() {
      var layers = {};

      _.each(this.layers, function(category) {
        _.extend(layers, category);
      });

      return layers;
    },
  });

  var layerSpecService = new LayerSpecService();

  return layerSpecService;
});
