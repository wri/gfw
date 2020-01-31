/**
 * Landsat Maptype.
 */
/* eslint-disable*/
define([], function () {

  'use strict';

  var LandsatMaptype = function(year, tileUrl) {
    // We want to set the url differently depending on the z level and year of
    // landsat data. For years before 2013 data is all pre-processed by google.
    // from 2013 onwards, we have pre-processed the z-levels between 0 and 11
    // in GCS. For higher z-levels the tiles come from a live EE-based service.

    var config = {
      name: 'Landsat ' + year,
      alt: 'Global forest height',
      maxZoom: 17,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        switch (year) {
          case 2013:
          case 2014:
          case 2015:
          case 2016:
          case 2017:
            return z > 11
              ? tileUrl.replace('{z}/{x}/{y}', z + '/' + x + '/' +ll.y)
              : 'https://storage.googleapis.com/landsat-cache/{0}/{1}/{2}/{3}.png'.format(year, z, x, ll.y);
            break;
          default:
            return window.gfw.config.GFW_API_OLD + '/gee/landsat_composites/{0}/{1}/{2}.png?year={3}'.format(z, x, ll.y, year);
            break;
        }
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return LandsatMaptype;
});
