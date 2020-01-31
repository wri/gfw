/**
 * The Indonesian Oil Palm Suitability layer module.
 * connected to BC issue https://basecamp.com/3063126/projects/10726176/todos/311103503
 * based on IdnPrimaryLayer
 * @return
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var IdnSuitabilityLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://storage.googleapis.com/gfw-data-layers/idn_suitability/{z}/{x}/{y}.png',
      dataMaxZoom: 13
    }

  });

  return IdnSuitabilityLayer;

});
