/**
 * The mediator module.
 *
 * Mediator listens to events fired by the Presenter and renders the 
 * appropriate views.
 * 
 * @return singleton instance of Mediator class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'Class',
  'presenter',
  'collections/layers',
  'views/map',
  'views/layersMenu',
  'views/legend',
  'views/layers/loss',
  'views/layers/gain',
  'views/layers/forest',
  'views/layers/imazon'
], function (_, Backbone, mps, Class, presenter, layersCollection, map, layersMenu, legend, 
    LossLayer, GainLayer, ForestLayer, ImazonLayer) {

  var Mediator = Class.extend({
    init: function() {
      var self = this;

      // Listen to presenter events
      presenter.on('change:zoom', this.updateZoom, this);
      presenter.on('change:latLng', this.updateCenter, this);
      // presenter.on('change:iso', this.mapChange, this);
      presenter.on('change:maptype', this.updateMapType, this);
      presenter.on('change:baselayers', this.updateBaselayers, this);
      presenter.on('change:sublayers', this.updateSublayers, this);
      presenter.on('change:timelineDate', this.updateBaselayersTiles, this);
      presenter.on('change:baselayers', legend.update, this);
      presenter.on('change:sublayers', legend.update, this);

      this.collections = {};
      this.layersInstances = {};
    },

    layersViews: {
      loss: LossLayer,
      umd_tree_loss_gain: GainLayer,
      imazon: ImazonLayer,
      forest2000: ForestLayer
    },

    updateBaselayers: function() {
      var currentBaselayers = presenter.get('baselayers'),
          allBaselayers = layersCollection.getBaselayers();

      // Render current baselayers
      for (var i = 0; i < currentBaselayers.length; i++) {
        var layerName = currentBaselayers[i];
        this.createLayerView(layerName);
      };

      // Remove baselayers
      for (var i = 0; i < allBaselayers.length; i++) {
        var layer = allBaselayers[i];
        if (currentBaselayers.indexOf(layer.slug) < 0 &&
            this.layersInstances[layer.slug]) {
          this.layersInstances[layer.slug].removeLayer();
        }
      };
    },

    updateSublayers: function() {
      var currentSublayers = presenter.get('sublayers'),
          allSublayers = layersCollection.getSublayers();

      // Render sublayers
      for (var i = 0; i < currentSublayers.length; i++) {
        var layerId = currentSublayers[i],
            layer = layersCollection.findWhere({ id: layerId }),
            layerName = layer.get('slug');

        this.createLayerView(layerName);
      };

      // Remove sublayers
      for (var i = 0; i < allSublayers.length; i++) {
        var layer = allSublayers[i];
        if (currentSublayers.indexOf(layer.id) < 0 &&
            this.layersInstances[layer.slug]) {
          this.layersInstances[layer.slug].removeLayer();
        }
      };
    },

    createLayerView: function(layerName) {
      if (!this.layersInstances[layerName]) {
        this.layersInstances[layerName] = new this.layersViews[layerName]();
      }
      this.layersInstances[layerName].render();
    },

    updateBaselayersTiles: function() {
      var baselayers = presenter.get('baselayers');

      for (var i = 0; i < currentBaselayers.length; i++) {
        var layerName = currentBaselayers[i];
        this.layersInstances[layerName].updateTiles();
      };
    },

    updateZoom: function() {
      map.updateZoom(Number(presenter.get('zoom')));
    },

    updateCenter: function() {
      map.updateCenter(presenter.get('latLng'));
    },

    updateMapType: function() {
      map.updateMapType(presenter.get('maptype'));
    }
  });

  var mediator = new Mediator();

  return mediator;

});