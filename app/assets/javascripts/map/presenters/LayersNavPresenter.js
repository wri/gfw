/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps',
  'services/MapLayerService'
], function(Class, _, mps, mapLayerService) {

  'use strict';

  var LayersNavPresenter = Class.extend({

    /**
     * Initialize LayersNavPresenter.
     *
     * @param  {object} Instance of LayersNavView
     */
    init: function(view) {
      this.view = view;
      this.mapLayerService = mapLayerService;
      this._subscribe();
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
    toggleLayer: function(layerSlug) {
      this.mapLayerService.getLayers([{slug: layerSlug}], function(layers) {
        mps.publish('LayerNav/toggle-layer', [layers[0]]);
        mps.publish('Place/update', [{go: false}]);
      });
    }

  });

  return LayersNavPresenter;
});
