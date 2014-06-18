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
], function (_, Backbone, mps, Class, presenter, layers, map, LossLayer, ForestLayer) {

  var Mediator = Class.extend({
    init: function() {
      
      // Listen to presenter events
      presenter.on('change:zoom', this.updateZoom, this);
      presenter.on('change:latLng', this.updateCenter, this);
      // presenter.on('change:iso', this.mapChange, this);
      // presenter.on('change:maptype', this.mapChange, this);
      presenter.on('change:baselayers', this.checkBaselayers, this);
      presenter.on('change:timelineDate', this.updateBaselayerTiles, this);

      this.collections = {};
      this.views = {};
    },

    baselayersOpts: {
      views: {
        loss: LossLayer,
        gain: ForestLayer
      },
      allowedCombined: [
        ['loss', 'gain']
      ]
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

    checkBaselayers: function() {
      var self = this, 
          baselayersArr = presenter.get('baselayers');

      if (this.validateBaselayers()) {

        // render baselayers
        _.each(baselayersArr, function(layerName) {
          if (!self.views[layerName + 'Layer']) {
            console.log('rendering', layerName)
            self.views[layerName + 'Layer'] = new self.baselayersOpts.views[layerName]();
          }
          self.views[layerName + 'Layer'].render();

        });

        // remove baselayers
        _.each(layers.getBaselayers(), function(layer) {
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
    }

  });

  var mediator = new Mediator();

  return mediator;

});
