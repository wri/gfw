/**
 * OpenStreetMaptype Matter Maptype.
 */
define([], function () {

  'use strict';

  var OpenStreetMaptype = function() {
    var config = {
      name: 'Open Street Map',
      alt: 'GFW Open street map',
      maxZoom: 16,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return 'https://a.tile.openstreetmap.org/{0}/{1}/{2}.png'.format(z, x, ll.y);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return OpenStreetMaptype;
});

