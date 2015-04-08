/**
 * The LayerSpecService class.
 *
 * @return LayerSpec instance.
 */
define([
  'Class',
  'underscore',
  'moment',
  'map/services/MapLayerService',
  'map/models/LayerSpecModel'
], function(Class, _, moment, mapLayerService, LayerSpecModel) {

  'use strict';

  var LayerSpecService = Class.extend({

    options: {
      forbidCombined: {
        forest_clearing: {
          except: [
            ['loss', 'forestgain']
          ]
        },
        geographic_coverage: {}
      }
    },

    init: function() {
      _.bindAll(this, '_removeLayer');
      this.model = new LayerSpecModel();
    },

    /**
     * Call mapLayerService to get the requested layers, and
     * then call _toggleLayer to toggle them.
     *
     * @param  {array}    where   layer slugs and ids
     * @param  {function} success callback
     * @param  {function} error   callback
     */
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
     * Add/delete a layer from the model.
     *
     * @param  {object} layer
     * @return {layer}  return layer or false.
     */
    _toggleLayer: function(layer) {
      var current = this.model.getLayer({slug: layer.slug});
      var baselayers = this.model.getBaselayers();

      // At least one baselayer active.
      // if (current && current.category_slug === 'forest_clearing' &&
      //   _.keys(baselayers).length === 1) {
      //   return false;
      // }

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
      category[layer.slug] = this._standardizeAttrs(layer);
    },

    /**
     * Remove a layer and its sublayer.
     * If the category stays empty, it deletes it.
     *
     * @param  {object} layer The layer object
     */
    _removeLayer: function(layer) {
      // delete layer
      delete this.model.get(layer.category_slug)[layer.slug];

      // delete its sublayers
      if (layer.sublayer) {
        var sublayer = this.model.getLayer({slug: layer.sublayer});
        sublayer && this._removeLayer(sublayer);
      }

      // delete category if empty
      if (_.isEmpty(this.model.get(layer.category_slug))) {
        this._removeCategory(layer.category_slug);
      }
    },

    /**
     * Set/get a layer category from the model.
     *
     * @param  {string} slug category slug
     * @return {object}      category
     */
    _getCategory: function(slug) {
      !this.model.get(slug) && this.model.set(slug, {});
      return this.model.get(slug);
    },

    /**
     * Remove a layer category from the model.
     *
     * @param  {string} slug category slug
     */
    _removeCategory: function(slug) {
      this.model.unset(slug);
    },

    /**
     * Validate is current layer combination is valid or not.
     *
     * @param  {object}  layer layer object
     * @return {boolean}       combination is valid
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
     * Standarize layer attributes.
     *
     * @param  {object} layer layer object
     * @return {object} layer
     */
    _standardizeAttrs: function(layer) {
      if (layer.mindate) {
        layer.mindate = moment(layer.mindate);
      }

      if (layer.maxdate) {
        layer.maxdate = moment(layer.maxdate);
      }

      return layer;
    },

    /**
     * Called by PlaceService. Returns place parameters representing the
     * state of the layers.
     *
     * @return {object} params
     */
    getPlaceParams: function() {
      var p = {};
      var sublayers = this.model.getSublayers();

      p.name = 'map';
      p.baselayers = _.map(_.keys(this.model.getBaselayers()), function(slug) {
        return {slug: slug};
      });
      p.sublayers = !_.isEmpty(sublayers) ? _.pluck(sublayers, 'id') : null;

      return p;
    },
  });

  var service = new LayerSpecService();

  return service;

});
