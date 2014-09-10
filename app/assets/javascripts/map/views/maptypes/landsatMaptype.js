/**
 * Landsat Maptype.
 */
define([], function () {

  'use strict';

  var LandsatMaptype = function(year) {
    var config = {
      name: 'Landsat '+year,
      alt: 'Global forest height',
      maxZoom: 17,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return '//gfw-apis.appspot.com/gee/landsat_composites/{0}/{1}/{2}.png?year={3}'.format(z, x, ll.y, year);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return LandsatMaptype;
});
