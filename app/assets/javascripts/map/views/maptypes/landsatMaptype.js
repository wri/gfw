/**
 * Landsat Maptype.
 */
define([], function () {

  'use strict';

  var LandsatMaptype = function(year, url) {
    // We want to set the zoom level differently depending on the year of the
    // landsat data. As diffrent z-levels exist for diffrent tile-sets.
    var zoom;
    if (year < 2015) {
      zoom = 17;
    } else if (year === 2015) {
      zoom = 13;
    } else if (year === 2016){
      zoom = 6;
    }
    var config = {
      name: 'Landsat ' + year,
      alt: 'Global forest height',
      maxZoom: zoom,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line

        return url !== null
          ? url.replace('{z}/{x}/{y}', z + '/' + x + '/' + ll.y)
          : window.gfw.config.GFW_API_HOST + '/gee/landsat_composites/{0}/{1}/{2}.png?year={3}'.format(z, x, ll.y, year);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return LandsatMaptype;
});
