/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/LayerValidatorService',
  'services/MapLayerService'
], function(Class, _, mps, layerValidatorService, mapLayerService) {

  'use strict';

  var LayersNavPresenter = Class.extend({

    /**
     * Initialize LayersNavPresenter.
     *
     * @param  {object} Instance of LayersNavView
     */
    init: function(view) {
      this.view = view;
      this.layerSpec = {};
      this._subscribe();
    },

    /**
     * Validates and toggle a layer on layerSpec. If the validation fails
     * it return false, else is returns the new layerSpec object.
     *
     * LayerSpec represent the current active layers.
     *
     *   forestChange: {
     *     gain: true,
     *     loss: true
     *   },
     *   forestCover: {
     *     forest2000: true
     *   }
     *
     * @param  {string} category  Layer category
     * @param  {string} layerSlug Layer slug
     *
     * @return {object} layerSpec Return the layers spec or false.
     */
    _layerSpec: function(layerObj, category) {
      if (layerObj == null || category == null) {
        return false;
      }

      // Don't change current layerSpec before validation pass.
      var layerSpec = _.clone(this.layerSpec);

      // Create category is needed.
      if (typeof layerSpec[category] === 'undefined') {
        layerSpec[category] = {};
      }

      if (!layerSpec[category][layerObj.slug]) {
        layerSpec[category][layerObj.slug] = layerObj;
      } else {
        delete layerSpec[category][layerObj.slug];

        if (Object.keys(layerSpec[category]).length < 1) {
          delete layerSpec[category];
        }
      }

      // Validate new layers spec
      if (layerValidatorService.validate(layerSpec)) {
        this.layerSpec = layerSpec;
        return this.layerSpec;
      }

      // Validation fails
      return false;
    },

    _getLayerSpec: function() {
      return this.layerSpec;
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('LayerNav/change', this.view._toggleSelected);
      mps.publish('Place/register', [this]);
    },

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */

    getPlaceParams: function() {
      var params = {};

      var baseLayers = this.layerSpec['forestChange'] || {};

      var sublayers = _.map(this.layerSpec, function(category, i) {
        if (i !== 'forestChange') {
          return category;
        }
      });

      // params.baselayers = _.map(baselayers, function(layer) {
      //   Return
      // });

      // var subLayers = _.filter(this.layers, function(layer) {
      //   return layer.category_slug !== 'forest_clearing';
      // });

      // params.baselayers = _.map(baseLayers, function(layer) {
      //   return layer.slug;
      // });

      // params.sublayers = _.map(subLayers, function(layer) {
      //   return layer.id;
      // });

      return params;
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(category, layerSlug) {
      mapLayerService.getLayers([{
        slug: layerSlug
      }], _.bind(function(layers) {
        var layerSpec = this._layerSpec(layers[0], category);

        if (layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }
      }, this));
    }

  });

  return LayersNavPresenter;
});
