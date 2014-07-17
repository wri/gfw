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
        }
      }
    },

    init: function() {
      this.model = new LayerSpecModel();
    },

    toggle: function(where, options, success, error) {
      var self = this;
      mapLayerService.getLayers(
        where,
        function(layers) {
          _.each(layers, function(layer) {
            self._toggleLayer(self._standardizeAttrs(layer, options));
          });
          success(self.model);
        },
        error);
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

      return layer;
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
      var p = {};
      p.name = 'map';
      p.baselayers = _.keys(this.model.getBaselayers()).join(',');
      p.sublayers = _.pluck(this.model.getSublayers(), 'id').join(',');
      p.date = _.map(this.model.getBaselayers(), function(layer) {
        if (layer.currentDate) {
          return '{0}-{1}'.format(layer.currentDate[0].format('X'),
            layer.currentDate[1].format('X'));
        }
      }).join(',');

      return p;
    },
  });

  var layerSpecService = new LayerSpecService();

  return layerSpecService;
});
