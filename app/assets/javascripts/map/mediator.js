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
  'views/layers/loss'
], function (_, Backbone, mps, Class, presenter, layers, map, LossLayer) {

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

    checkBaselayers: function() {
      var baseLayer = presenter.get('baseLayer');

      // Remove baselayers
      _.each(layers.getBaselayers(), _.bind(function(layer) {
        if (this.views[layer.slug + 'Layer']) {
          this.views[layer.slug + 'Layer'].removeLayer();
        }
      }, this));
      
      if (!this.views[baseLayer + 'Layer']) {
        this.views[baseLayer + 'Layer'] = new LossLayer();
      }

      // Render current Baselayer
      this.views[baseLayer + 'Layer'].render();
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
