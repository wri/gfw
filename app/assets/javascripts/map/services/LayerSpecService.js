/**
 * The LayerSpecService class.
 *
 * @return LayerSpec instance.
 */
define([
  'Class',
  'underscore',
  'services/MapLayerService',
  'models/LayerSpecModel'
], function(Class, _, mapLayerService, LayerSpecModel) {

  'use strict';

  var LayerSpecService = Class.extend({

    options: {
      forbidCombined: {
        forest_clearing: {
          except: [
            ['umd_tree_loss_gain', 'forestgain']
          ]
        }
      }
    },

    init: function() {
      this.model = new LayerSpecModel();
    },

    toggle: function(where, success, error) {
      mapLayerService.getLayers(
        where,
        _.bind(function(layers) {
          _.map(layers, this._toggleLayer, this);
          success(this.model);
        }, this),
        error);
    },

    _toggleLayer: function(layer) {
      var current = this.model.getLayer({slug: layer.slug});

      // At least one baselayer selected.
      if (current && current.category_slug === 'forest_clearing' &&
        _.keys(this.model.getBaselayers()).length === 1) {
        return;
      }

      if (current) {
        this._removeLayer(current);

        if (_.keys(this.model.get(layer.category_slug)).length < 1) {
          this._removeCategory(layer.category_slug);
        }
      } else {
        this._addLayer(layer);
      }
    },

    /**
     * Add a layer to the model.
     * It destroys all the sibling models at the same category if
     * forbidCombinated is set for that category.
     *
     * @param {object} layer
     */
    _addLayer: function(layer) {
      this._addCategory(layer.category_slug);
      var category =  this.model.get(layer.category_slug);
      this._removeForbiddenLayers(layer);
      category[layer.slug] = layer;
    },

    _removeLayer: function(layer) {
      delete this.model.get(layer.category_slug)[layer.slug];
    },

    _addCategory: function(slug) {
      if (!this.model.get(slug)) {
        this.model.set(slug, {});
      }
    },

    _removeCategory: function(slug) {
      this.model.unset(slug);
    },

    _removeForbiddenLayers: function(layer) {
      var forbidden = this.options.forbidCombined[layer.category_slug];

      if (forbidden) {
        var passException = false;

        if (forbidden.except) {
          var combination = _.pluck(this.model.get(layer.category_slug), 'slug');
          combination.push(layer.slug);

          passException = true;
          _.each(forbidden.except, _.bind(function(exception) {
            passException = passException &&
              (_.difference(combination, exception).length < 1);
          }, this));
        }

        if (!passException) {
          // TODO => Don't delete all layers, just the ones which can't be togther
          _.map(this.model.get(layer.category_slug), this._removeLayer, this);
        }
      }
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
        baselayers: _.keys(this.model.getBaselayers()).join(','),
        sublayers: _.pluck(this.model.getSublayers(), 'id').join(',')
      };
    },


  });

  var layerSpecService = new LayerSpecService();

  return layerSpecService;
});
