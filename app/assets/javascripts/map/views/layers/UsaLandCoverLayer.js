/**
 * The Pantropical layer module for use on canvas.
 *
 * @return UsaLandCoverLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var UsaLandCoverLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/wri-tiles/usa_landcover{/z}{/x}{/y}.png',
      dataMaxZoom: 12
    }

  });

  return UsaLandCoverLayer;

});
