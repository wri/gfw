/**
 * The CartoDB Torque map layer module.
 * @return TorqueLayerClass (extends LayerClass).
 */
define([
  'underscore',
  'abstract/layer/OverlayLayerClass',
  'text!map/cartocss/default_torque_style.cartocss'
], function(_, OverlayLayerClass, CARTOCSS) {

  'use strict';

  var REQUIRED_OPTIONS = ['table', 'column'];

  var TorqueLayerClass = OverlayLayerClass.extend({

    defaults: {
      user: 'wri-01',
      cartocss: CARTOCSS,
      cartodb_logo: false,
      countby: 'count(cartodb_id)',
      resolution: 2,
      steps: 256,
      blendmode  : 'lighter',
      animationDuration: 30
    },

    init: function(layer, options, map) {
      this._validateOptions();
      this._super(layer, options, map);
    },

    _validateOptions: function(options) {
      REQUIRED_OPTIONS.forEach(function(option_name) {
        if (!this.options.hasOwnProperty(option_name)) {
          throw new Error("Missing " + option_name + " option");
        }
      }, this);
    },

    _getLayer: function() {
      var deferred = new $.Deferred();

      var torqueOptions = _.extend(this.options, {map: this.map}),
          torqueLayer = new torque.GMapsTorqueLayer(torqueOptions);

      var onTimeChange = function(change) {
        // Torque currently has no "on ready" event, so wait until it
        // starts spitting out valid step changes
        if (change.time > 0 && !isNaN(change.time)) {
          torqueLayer.off('change:time', onTimeChange);
          deferred.resolve(torqueLayer);
        }
      };
      torqueLayer.on('change:time', onTimeChange);

      torqueLayer.setMap(this.map);
      torqueLayer.play()

      return deferred.promise();
    }

  });

  return TorqueLayerClass;
});
