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
  'views/layers/loss',
  'views/layers/gain',
  'views/layers/forest',
  'views/layers/imazon'
], function (_, Backbone, mps, Class, presenter, layersCollection, map, layersMenu, LossLayer, GainLayer, ForestLayer, ImazonLayer) {

  var Mediator = Class.extend({
    init: function() {
      var self = this;

      // Listen to presenter events
      presenter.on('change:zoom', this.updateZoom, this);
      presenter.on('change:latLng', this.updateCenter, this);
      // presenter.on('change:iso', this.mapChange, this);
      presenter.on('change:maptype', this.updateMapType, this);
      presenter.on('change:baselayers', this.updateBaselayers, this);
      presenter.on('change:sublayers', this.updateSublayer, this);
      presenter.on('change:timelineDate', this.updateBaselayerTiles, this);

      this.collections = {};
      this.layerViews = {};
    },

    baselayersViews: {
      loss: LossLayer,
      umd_tree_loss_gain: GainLayer,
      imazon: ImazonLayer
    },

    sublayersViews: {
      forest2000: ForestLayer
    },

    updateBaselayers: function() {
      var self = this, 
          baselayersArr = presenter.get('baselayers');

      if (presenter.validateBaselayers(baselayersArr)) {
        // render baselayers
        _.each(baselayersArr, function(layerName) {
          if (!self.layerViews[layerName]) {
            self.layerViews[layerName] = new self.baselayersViews[layerName]();
          }
          self.layerViews[layerName].render();
        });

        // remove baselayers
        _.each(layersCollection.getBaselayers(), function(layer) {
          if (baselayersArr.indexOf(layer.slug) == -1) {
            if (self.layerViews[layer.slug]) {
              self.layerViews[layer.slug].removeLayer();
            }
          }
        });

      }
    },

    updateSublayer: function() {
      var self = this,
          sublayersArr = presenter.get('sublayers');

      // render sublayers
      _.each(sublayersArr, function(layerId) {
        var layer = layersCollection.findWhere({id: Number(layerId)});
        if (layer) {
          var layerName = layer.get('slug');
          if (!self.layerViews[layerName]) {
            self.layerViews[layerName] =  new self.sublayersViews[layerName]();
          }
          self.layerViews[layerName].render();
        }
      });

      // remove sublayers
      _.each(layersCollection.getSublayers(), function(layer) {
        if (sublayersArr.indexOf(layer.id) == -1) {
          if (self.layerViews[layer.slug]) {
            self.layerViews[layer.slug].removeLayer();
          }
        }
      });
    },

    updateBaselayerTiles: function() {
      var self = this, 
          baselayers = presenter.get('baselayers');

      _.each(baselayers, function(layerName) {
        self.layerViews[layerName].updateTiles();
      });
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