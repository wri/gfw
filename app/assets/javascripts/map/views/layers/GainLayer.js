/**
 * The Imazon layer module for use on canvas.
 *
 * @return GainLayer class (extends ImageLayerClass)
 */
define([
  'views/layers/class/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var GainLayer = ImageLayerClass.extend({

    options: {
      dataMaxZoom: 19,
      urlTemplate: 'http://earthengine.google.org/static/hansen_2013/gain_alpha{/z}{/x}{/y}.png'
    },

    init: function(layer) {
      this._super(layer);
    }
  });

  return GainLayer;

});
