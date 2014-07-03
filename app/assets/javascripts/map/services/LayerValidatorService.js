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

  var LayerValidatorService = Class.extend({

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
    validate: function() {
      var result = true;
      // validate here
      return result;
    }
  });

  var layerValidatorService = new LayerValidatorService();

  return layerValidatorService;
});
