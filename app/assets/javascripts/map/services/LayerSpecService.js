/**
 * The LayerSpec class.
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

    // add layers to the layerSpec
    // This acceps an object {slugs:[], ids:[]}, the easiest way to add layers to i can think of right
    // now.
    add: function(layers) {
      var where = [];
      var deferred = new $.Deferred();

      _.each(layers.slugs, function(slug) {
        where.push({slug: slug});
      });

      _.each(layers.ids, function(id) {
        where.push({id: Number(id)});
      });

      mapLayerService.getLayers(where, _.bind(function(results) {
        // doesn't set the layerSpec until it's validated, so we layerSpec always is cool.
        var layers = _.clone(this.layers);

        _.each(results, _.bind(function(layer) {
          layers[layer.category_slug] = layers[layer.category_slug] || {};
          layers[layer.category_slug][layer.slug] = layer;
        }, this));

        // If validation pass return the new layer spec, else is return the old
        // layerSpec and and error message
        if (layerValidatorService.validate(layers)) {
          this.layers = layers;
          deferred.resolve(this);
        } else {
          deferred.resolve(this, 'Error validating');
        }

      }, this));

      return deferred.promise();;
    },

    // remove layers to the layerSpec
    remove: function(layers) {
    },

    getBaselayers: function() {
      return this.layers.forestChange;
    },

    getSublayers: function() {
    }
  });

  var layerSpecService = new LayerSpecService();

  return layerSpecService;
});
