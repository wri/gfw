/**
 * The Indonesia Primary Forest layer module.
 *
 * @return IdnPrimaryLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var ColombiaForestChangeLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/wri-tiles/colombia_forest_change_2013/{z}/{x}/{y}.png',
      dataMaxZoom: 11
    }

  });

  return ColombiaForestChangeLayer;

});
