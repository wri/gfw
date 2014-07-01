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

    init: function() {
      this.layers = [];
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.layers = place.params.layers;
      }, this));
    },

    /**
     * Validates layers array.
     *
     * @return {boolean) True/false if validation passed.
     */
    validate: function(layersArr) {
      var result = true;

      return result;
    }

  });

  var layerValidator = new LayerValidator();

  return layerValidator;
});
