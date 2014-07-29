/**
 * The LayerSpecService class.
 *
 * @return LayerSpec instance.
 */
define([
  'Class',
  'underscore',
  'moment',
  'services/MapLayerService',
  'models/LayerSpecModel'
], function(Class, _, moment, mapLayerService, LayerSpecModel) {

  'use strict';

  var LayerSpecService = Class.extend({

    options: {
      forbidCombined: {
        forest_clearing: {
          except: [
            ['umd_tree_loss_gain', 'forestgain']
          ]
        },
        geographic_coverage: {}
      }
    },

    init: function() {
      _.bindAll(this, '_removeLayer');
      this.model = new LayerSpecModel();
    },

    toggle: function(where, success, error) {
      mapLayerService.getLayers(
        where,
        _.bind(function(layers) {
          _.each(layers, this._toggleLayer, this);
          success(this.model);
        }, this),
        error);
    },

    /**
     * Toggle a layer form LayerSpecModel.
     *
     * @param  {object} layer
     * @return {layer}  return layer or false.
     */
    _toggleLayer: function(layer) {
      var current = this.model.getLayer({slug: layer.slug});
      var baselayers = this.model.getBaselayers();

      // At least one baselayer active.
      if (current && current.category_slug === 'forest_clearing' &&
        _.keys(baselayers).length === 1) {
        return false;
      }

      if (current) {
        this._removeLayer(current);
        return false;
      } else {
        if (!this._combinationIsValid(layer)) {
          _.each(this.model.get(layer.category_slug), this._removeLayer);
        }

        this._addLayer(layer);
        return layer;
      }
    },

    /**
     * Add a layer to the model.
     *
     * @param {object} layer
     */
    _addLayer: function(layer) {
      var category = this._getCategory(layer.category_slug);
      // options = !_.isEmpty(options) ? options : this._getOptionsFromLayers();
      category[layer.slug] = this._standardizeAttrs(layer);
    },

    _getCategory: function(name) {
      !this.model.get(name) && this.model.set(name, {});
      return this.model.get(name);
    },

    /**
     * Remove a layer and its sublayer.
     * If the category stays empty, it deletes it.
     *
     * @param  {object} layer The layer object
     */
    _removeLayer: function(layer) {
      delete this.model.get(layer.category_slug)[layer.slug];

      if (layer.sublayer) {
        var sublayer = this.model.getLayer({slug: layer.sublayer});
        sublayer && this._removeLayer(sublayer);
      }

      if (_.isEmpty(this.model.get(layer.category_slug))) {
        this._removeCategory(layer.category_slug);
      }
    },

    _removeCategory: function(categorySlug) {
      this.model.unset(categorySlug);
    },

    /**
     * Validate is current layer combination is valid or not.
     *
     * @param  {[type]} layer [description]
     * @return {[type]}       [description]
     */
    _combinationIsValid: function(layer) {
      var currentLayers = this.model.get(layer.category_slug);
      var forbidden = this.options.forbidCombined[layer.category_slug];
      if (!forbidden) {return true;}
      var validCombination = false;

      if (forbidden.except) {
        var combination = _.union(_.pluck(currentLayers, 'slug'), [layer.slug]);
        combination.push(layer.slug);
        _.each(forbidden.except, function(exception) {
          if (_.difference(combination, exception).length < 1) {
            validCombination = true;
          }
        }, this);
      }

      return validCombination;
    },

    /**
     * TODO => When we toggle a layer, we could get to the point where we are destroying a layer
     * and later, when we want to toggle it back, we want some options from the url to append them
     * to the layer. This happends on the PlaceService whenever we have a new route (go=true).
     * But then, layerSpec object is moving around without passing any more options.
     *
     * Instead passing options to the LayerSpec.toggle, it would be better to inject PlaceService
     * into this service and get the url params whenever we need it. This means we need to
     * change the way this service is initialized. In the meantime, we can use this function, to
     * get those params from other active layers.
     *
     * @return {object} options object
     */
    _getOptionsFromLayers: function() {
      var options = {};

      _.each(this.model.getLayers(), function(layer) {
        if (layer.threshold) {
          options.threshold = layer.threshold;
        }
      });

      return options;
    },

    /**
     * Standarize layer attributes.
     *
     * @param  {obj} layer The layer object
     * @param  {obj} opts  Layer extra parameters.
     * @return {obj} layer The layer object
     */
    _standardizeAttrs: function(layer) {
      if (layer.mindate) {
        layer.mindate = moment(layer.mindate);
      }

      if (layer.maxdate) {
        layer.maxdate = moment(layer.maxdate);
      }

      // if (options.date && layer.category_slug === 'forest_clearing' &&
      //   layer.slug !== 'forestgain') {
      //   layer.currentDate = options.date;
      // }

      // if (options.threshold && (layer.slug === 'forest2000' || layer.slug === 'umd_tree_loss_gain')) {
      //   layer.threshold = Number(options.threshold);
      // }

      return layer;
    },

    /**
     * Return array of filter objects {slug:, category_slug:} for baselayers.
     *
     * @param  {string} layers Array of baselayer slug names
     * @return {Array} Filter  objects for baselayers
     */
    getBaselayerFilters: function(layers) {
      var filters = _.map(layers, function (name) {
        return {slug: name, category_slug: 'forest_clearing'};
      });

      return filters;
    },

    /**
     * Return array of filter objects {id:} for sublayers.
     *
     * @param  {array} layers Array of sublayer ids
     * @return {Array} Filter objects for sublayers
     */
    getSublayerFilters: function(layers) {
      var filters = _.map(layers, function(id) {
        return {id: Number(id)};
      });

      return filters;
    },

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */
    getPlaceParams: function() {
      var p = {};
      var sublayers = this.model.getSublayers();

      p.name = 'map';
      p.baselayers = _.keys(this.model.getBaselayers());
      p.sublayers = !_.isEmpty(sublayers) ? _.pluck(sublayers, 'id') : null;

      return p;
    },
  });

  var service = new LayerSpecService();

  return service;
});
