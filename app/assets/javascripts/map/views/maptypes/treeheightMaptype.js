/**
 * Threeheight Maptype.
 */
define([], function () {

  'use strict';

  var TreeheightMaptype = function() {
    var config = {
      name: 'Forest Height',
      alt: 'Global forest height',
      maxZoom: 9,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return 'https://s3.amazonaws.com/wri-tiles/tree-height/{0}/{1}/{2}.png'.format(z, x, ll.y);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return TreeheightMaptype;
});
