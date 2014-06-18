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
  'views/layers/loss',
  'views/layers/forest'
], function (_, Backbone, mps, Class, presenter, layersCollection, map, LossLayer, ForestLayer) {

  var Mediator = Class.extend({
    init: function() {
      
      // Listen to presenter events
      presenter.on('change:zoom', this.updateZoom, this);
      presenter.on('change:latLng', this.updateCenter, this);
      // presenter.on('change:iso', this.mapChange, this);
      presenter.on('change:maptype', this.updateMapType, this);
      presenter.on('change:baselayers', this.updateBaselayers, this);
      presenter.on('change:sublayers', this.updateSublayer, this);
      presenter.on('change:timelineDate', this.updateBaselayerTiles, this);

      this.collections = {};
      this.views = {};
    },

    baselayersOpts: {
      views: {
        loss: LossLayer,
        gain: LossLayer
      },
      allowedCombined: [
        ['loss', 'gain']
      ]
    },

    sublayersOpts: {
      views: {
        forest2000: ForestLayer
      }
    },

    validateBaselayers: function() {
      var baselayersArr = presenter.get('baselayers'),
          valid = false;

      _.each(this.baselayersOpts.allowedCombined, function(layersArr) {
        if (baselayersArr.length == 1 || $(baselayersArr).not(layersArr).length == 0 && $(layersArr).not(baselayersArr).length == 0) {
          valid = true;
        }
      });

      return valid;
    },

    updateBaselayers: function() {
      var self = this, 
          baselayersArr = presenter.get('baselayers');

      if (this.validateBaselayers()) {

        // render baselayers
        _.each(baselayersArr, function(layerName) {
          if (!self.views[layerName + 'Layer']) {
            self.views[layerName + 'Layer'] = new self.baselayersOpts.views[layerName]();
          }
          self.views[layerName + 'Layer'].render();

        });

        // remove baselayers
        _.each(layersCollection.getBaselayers(), function(layer) {
          if (baselayersArr.indexOf(layer.slug) == -1) {
            if (self.views[layer.slug + 'Layer']) {
              self.views[layer.slug + 'Layer'].removeLayer();
            }
          }
        });

      } else {
        console.log('invalid baselayers.')
        // wrong baselayers..
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
          if (!self.views[layerName + 'Layer']) {
            self.views[layerName + 'Layer'] =  new self.sublayersOpts.views[layerName]();
          }
          self.views[layerName + 'Layer'].render();
        }
      });

      // remove sublayers
      _.each(layersCollection.getSublayers(), function(layer) {
        if (sublayersArr.indexOf(layer.id.toString()) == -1) {
          if (self.views[layer.slug + 'Layer']) {
            self.views[layer.slug + 'Layer'].removeLayer();
          }
        }
      });
    },

    updateBaselayerTiles: function() {
      var self = this, 
          baselayers = presenter.get('baselayers');

      _.each(baselayers, function(layerName) {
        self.views[layerName + 'Layer'].updateTiles();
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
