/**
 * The Indonesia Primary Forest layer module.
 *
 * @return IdnPrimaryLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var IdnPrimaryLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/wri-tiles/idnfc_wgs84/{z}/{x}/{y}.png',
      dataMaxZoom: 11
    }

  });

  return IdnPrimaryLayer;

});
