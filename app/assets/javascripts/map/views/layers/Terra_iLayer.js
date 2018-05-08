/**
 * The Pantropical layer module for use on canvas.
 *
 * @return Terra_iLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var Terra_iLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://www.terra-i.org/latin-america/Z{z}/{y}/{x}.png',
      dataMaxZoom: 8
    }

  });

  return Terra_iLayer;

});