/**
 * UrtheCast Matter Maptype.
 */
define([], function () {

  'use strict';

  var urthecastMaptype = function() {
    var config = {
      name: 'UrtheCast Matter',
      alt: 'Global forest UrtheCast',
      maxZoom: 16,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return 'https://tile-c.urthecast.com/v1/rgb/{0}/{1}/{2}?&api_key=BAD04ABC498549E3B3CF&api_secret=081547A210CA4369B9A69D69E3753D6D&cloud_coverage_lte=100&acquired_gte=2000-09-01T00:00:00Z'.format(z, x, ll.y);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return urthecastMaptype;
});

