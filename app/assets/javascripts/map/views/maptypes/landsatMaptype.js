/**
 * Landsat Maptype.
 */
define([], function () {

  'use strict';

  var LandsatMaptype = function(year, tileUrl) {
    // We want to set the zoom level differently depending on the year of the
    // landsat data. As diffrent z-levels exist for diffrent tile-sets.

    var config = {
      name: 'Landsat ' + year,
      alt: 'Global forest height',
      maxZoom: 17,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line

        switch (year) {
          case 2015:
          case 2016:
            return z === 12 || z === 13
              ? tileUrl.replace('{z}/{x}/{y}', z + '/' + x + '/' +ll.y)
              : 'https://storage.googleapis.com/landsat-cache/{0}/{1}/{2}/{3}.png'.format(year, z, x, ll.y);
            break;
          default:
            return window.gfw.config.GFW_API_HOST + '/gee/landsat_composites/{0}/{1}/{2}.png?year={3}'.format(z, x, ll.y, year);
            break;
        }
      },
    };

    if (year === 2015 || year === 2016) {
      config['maxZoom'] = 13;
    }

    return new google.maps.ImageMapType(config);
  };

  return LandsatMaptype;
});
