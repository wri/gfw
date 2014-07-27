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

    toggle: function(where, options, success, error) {
      var self = this;
      mapLayerService.getLayers(
        where,
        function(layers) {
          _.each(layers, function(layer) {
            self._toggleLayer(layer, options);
          });
          success(self.model);
        },
        error);
    },

    /**
     * Toggle a layer form LayerSpecModel.
     * 
     * @param  {object} layer
     * @return {layer}  return layer or false.
     */
    _toggleLayer: function(layer, options) {
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
        this._addLayer(layer, options);
        return layer;
      }
    },

    /**
     * Add a layer to the model.
     *
     * @param {object} layer
     */
    _addLayer: function(layer, options) {
      var category = this._getCategory(layer.category_slug);
      options = !_.isEmpty(options) ? options : this._getOptionsFromLayers();
      category[layer.slug] = this._standardizeAttrs(layer, options);
    },

    _getCategory: function(name) {
      !this.model.get(name) && this.model.set(name, {});
      return this.model.get(name);
    },

    /**
     * Remove a layer and its sublayers.
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
    _standardizeAttrs: function(layer, options) {
      if (layer.mindate) {
        layer.mindate = moment(layer.mindate);
      }

      if (layer.maxdate) {
        layer.maxdate = moment(layer.maxdate);
      }

      if (options.date && layer.category_slug === 'forest_clearing' &&
        layer.slug !== 'forestgain') {
        layer.currentDate = options.date;
      }

      if (options.threshold && (layer.slug === 'forest2000' || layer.slug === 'umd_tree_loss_gain')) {
        layer.threshold = Number(options.threshold);
      }

      return layer;
    },

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */
    getPlaceParams: function() {
      var p = {};
      p.name = 'map';
      p.baselayers = _.keys(this.model.getBaselayers()).join(',');
      p.sublayers = _.pluck(this.model.getSublayers(), 'id').join(',');

      var date = [];

      _.each(this.model.getBaselayers(), function(layer) {
        if (layer.currentDate) {
          date.push('{0}-{1}'.format(layer.currentDate[0].format('X'),
            layer.currentDate[1].format('X')));
        }
      });

      if (date.length > 0) {
        p.date = date.join(',');
      }

      return p;
    },
  });

  var service = new LayerSpecService();

  return service;
});
