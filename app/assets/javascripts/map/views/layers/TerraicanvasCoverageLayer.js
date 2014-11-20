/**
 *
 * @return TerraicanvasCoverageLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var TerraicanvasCoverageLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://s3.amazonaws.com/wri-tiles/terra_i_coverage/{z}/{x}/{y}.png',
      dataMaxZoom: 8
    }

  });

  return TerraicanvasCoverageLayer;

});
