/**
 * Threeheight Maptype.
 */
define([], function () {

  'use strict';

  var treeheightMaptype = function() {
    var config = {
      name: 'Forest Height',
      alt: 'Global forest height',
      maxZoom: 17,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl: function(ll, z) {
        var x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return window.gfw.config.GFW_API_HOST + '/gee/simple_green_coverage/{0}/{1}/{2}.png'.format(z, x, ll.y);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return treeheightMaptype;
});
