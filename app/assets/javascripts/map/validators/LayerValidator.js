/**
 * The LayerValidator class.
 *
 * @return LayerValidator instance.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var LayerValidator = Class.extend({

    baselayersOpts: {
      allowCombined: [
        ['loss', 'gain']
      ]
    },

    init: function() {
      this.activeLayers = [];
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.activeLayers = place.params.layers;
      }, this));
    },

    /**
     * Validates layers array.
     *
     * @return {boolean) True/false if validation passed.
     */
    validate: function(layerName) {
      var result = true;

      // validate here

      return result;
    }
  });

  var layerValidator = new LayerValidator();

  return layerValidator;
});
