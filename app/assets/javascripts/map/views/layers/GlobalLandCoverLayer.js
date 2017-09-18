/**
 * The Pantropical layer module for use on canvas.
 *
 * @return UsaLandCoverLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var GlobalLandCoverLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'http://wri-tiles.s3.amazonaws.com/global-landcover-2015/{z}/{x}/{y}.png',
      dataMaxZoom: 9
    }

  });

  return GlobalLandCoverLayer;

});
