/**
 * The Pantropical layer module for use on canvas.
 *
 * @return PantropicalLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageMaptypeLayerClass',
], function(ImageMaptypeLayerClass) {

  'use strict';

  var PantropicalLayer = ImageMaptypeLayerClass.extend({

    options: {
      urlTemplate: window.gfw.config.GFW_API_HOST + '/gee/masked_forest_carbon{/z}{/x}{/y}.png'
    }

  });

  return PantropicalLayer;

});
