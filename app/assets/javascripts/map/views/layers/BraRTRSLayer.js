/**
 * The Brazilian RTRS soy layer module.
 * connected to BC issue https://basecamp.com/3063126/projects/10726176/todos/311103365
 * based on IdnPrimaryLayer
 * @return
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var BraRTRSLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://storage.googleapis.com/gfw-data-layers/BRA_RTRS_soy/{z}/{x}/{y}.png',
      dataMaxZoom: 13
    }

  });

  return BraRTRSLayer;

});
