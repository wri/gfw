/**
 * The ProtectedAreas layer module for use on canvas.
 *
 * @return ProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/ImageMaptypeLayerClass',
], function(ImageMaptypeLayerClass) {

  'use strict';

  var ProtectedAreasLayer = ImageMaptypeLayerClass.extend({

    options: {
      urlTemplate: '//184.73.201.235/blue{/z}{/x}{/y}'
    }

  });

  return ProtectedAreasLayer;

});
