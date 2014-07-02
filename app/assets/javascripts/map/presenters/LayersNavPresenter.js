/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/LayerValidatorService'
], function(Class, _, mps, mapLayerService, layerValidatorService) {

  'use strict';

  var LayersNavPresenter = Class.extend({

    /**
     * Initialize LayersNavPresenter.
     *
     * @param  {object} Instance of LayersNavView
     */
    init: function(view) {
      this.view = view;
      this.layers = {};
      this._subscribe();
    },


    /**
     * Getter/setter of Layers Spec.
     *
     * @param  {string} category   Layer category
     * @param  {string} layerSlug  Layer slug
     *
     * @return {object} layersSpec Return the layers spec object if
     *                             called withouts params.
     */
    _layersSpec: function(category, layerSlug) {
      if (category == null || layerSlug == null) {
        return this.layers;
      }

      if (typeof this.layers[category] === 'undefined') {
        this.layers[category] = {};
      }

      this.layers[category][layerSlug] = !(this.layers[category][layerSlug]);
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('LayerNav/toggle-layer', this.view._toggleSelected);
      mps.publish('place/register', [this]);
    },

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */

    getPlaceParams: function() {
      var params = {};

      // var baseLayers = _.where(this.layers, {category_slug: 'forest_clearing'});
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
      this._layersSpec(category, layerSlug);

      var layerSpec = this._layersSpec();

      // if (layerSlug && layerValidatorService.validate(layerSpec)) {
      //   mps.publish('LayerNav/toggle-layer', [layerSpec]);
      //   mps.publish('Place/update', [{go: false}]);
      // }
    }

  });

  return LayersNavPresenter;
});
