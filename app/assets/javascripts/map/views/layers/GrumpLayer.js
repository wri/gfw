/**
 * The Pantropical layer module for use on canvas.
 *
 * @return GrumpLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageMaptypeLayerClass',
], function(ImageMaptypeLayerClass) {

  'use strict';

  var GrumpLayer = ImageMaptypeLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/grump-tiles/grump2000{/z}{/x}{/y}.png'
    }

  });

  return GrumpLayer;

});
