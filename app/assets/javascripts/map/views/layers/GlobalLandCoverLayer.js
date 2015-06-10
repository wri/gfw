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
      urlTemplate: 'https://s3.amazonaws.com/wri-tiles/global-landcover/{z}/{x}/{y}.png',
      dataMaxZoom: 9
    }

  });

  return GlobalLandCoverLayer;

});