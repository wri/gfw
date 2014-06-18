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
      presenter.on('change:baseLayer', this.checkBaselayers, this);
      presenter.on('change:timelineDate', this.updateBaselayerTiles, this);
      presenter.on('change:zoom', this.mapChange, this);
      presenter.on('change:mapType', this.mapChange, this);

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
      var baseLayersArr = presenter.get('baseLayer'),
          valid = false;

      _.each(this.baselayersOpts.allowedCombined, function(layersArr) {
        if (baseLayersArr.length == 1 || $(baseLayersArr).not(layersArr).length == 0 && $(layersArr).not(baseLayersArr).length == 0) {
          valid = true;
        }
      });

      return valid;
    },

    checkBaselayers: function() {
      var self = this, 
          baseLayersArr = presenter.get('baseLayer');

      if (this.validateBaselayers()) {

        // render baselayers
        _.each(baseLayersArr, function(layerName) {
          if (!self.views[layerName + 'Layer']) {
            console.log('rendering', layerName)
            self.views[layerName + 'Layer'] = new self.baselayersOpts.views[layerName]();
          }
          self.views[layerName + 'Layer'].render();

        });

        // remove baselayers
        _.each(layers.getBaselayers(), function(layer) {
          if (baseLayersArr.indexOf(layer.slug) == -1) {
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
      var baseLayer = presenter.get('baseLayer');
      this.views[baseLayer + 'Layer'].updateTiles();
    },

    mapChange: function() {
      map.updateMap();
    }
  });

  var mediator = new Mediator();

  return mediator;

});
