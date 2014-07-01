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

    init: function(layer) {
      this._super(layer);
      this.dataMaxZoom = 19;
      this._urlTemplate = 'http://earthengine.google.org/static/hansen_2013/gain_alpha{/z}{/x}{/y}.png';
    }
  });

  return GainLayer;

});
