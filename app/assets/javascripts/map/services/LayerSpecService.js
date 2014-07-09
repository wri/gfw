/**
 * The LayerSpecService class.
 *
 * @return LayerSpec instance.
 */
define([
  'Class',
  'underscore',
  'services/MapLayerService',
  'services/LayerValidatorService'
], function(Class, _, mapLayerService, layerValidatorService) {

  'use strict';

  var LayerSpecService = Class.extend({

    init: function() {
      this.layers = {};
    },

    /**
     * Asynchronously set the LayerSpec object and validates it.
     *
     * @param {array}    where   Array of slugs and ids. [{id: 591}, {slug: 'forest2000'}]
     * @param {callback} success Return valitaded layerSpec instance.
     * @param {callback} error   Return error
     */
    add: function(where, success, error) {
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
        }, this));
    },

    toggleLayer: function(where, success, error) {
      mapLayerService.getLayers(
        where,
        _.bind(function(results) {
          var layer = results[0];
          var layers = _.clone(this.layers);

          if (_.findWhere(this.getLayers(), {slug: layer.slug})) {
            delete layers[layer.category_slug][layer.slug];
            if (_.keys(layers[layer.category_slug]) < 1) {
              delete layers[layer.category_slug];
            }
          } else {
            layers[layer.category_slug] = layers[layer.category_slug] || {};
            layers[layer.category_slug][layer.slug] = layer;
          }

          if (layerValidatorService.validate(layers)) {
            this.layers = layers;
            success(this);
          } else {
            error(this, 'Error validating');
          }
        }, this));
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

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */
    getPlaceParams: function() {
      return {
        name: 'map',
        baselayers: _.keys(this.getBaselayers()).join(','),
        sublayers: _.pluck(this.getSublayers(), 'id').join(',')
      };
    }
  });

  var layerSpecService = new LayerSpecService();

  return layerSpecService;
});
