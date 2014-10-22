/**
 * The Pantropical layer module for use on canvas.
 *
 * @return GrumpLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var GrumpLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/grump-tiles/grump-base{/z}{/x}{/y}.png',
      dataMaxZoom: 8
    }

  });

  return GrumpLayer;

});
