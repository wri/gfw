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
      urlTemplate:'https://s3.amazonaws.com/wri-tiles/tropicalcarbonstock{/z}{/x}{/y}.png'
    }

  });

  return PantropicalLayer;

});
