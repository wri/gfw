/**
 * The Urthecast layer module for use on canvas.
 *
 * @return UrthecastLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var UrthecastLayer = ImageLayerClass.extend({
    options: {
      urlTemplate:'http://uc.gfw-apis.appspot.com/urthecast/map-tiles{/sat}{/z}{/x}{/y}?cloud_coverage_lte={cloud}&acquired_gte={mindate}T00:00:00Z&acquired_lte={maxdate}T00:00:z00Z',
      dataMaxZoom: 13
    }

  });

  return UrthecastLayer;

});
