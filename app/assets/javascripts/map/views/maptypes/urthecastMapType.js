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
        if (!sessionStorage.getItem('urthe')) {
          var params = {
             'color_filter': 'rgb',
             'cloud': '100',
             'mindate': '2000-09-01',
             'maxdate': '2015-09-01'
           }
        } else {
          var params = JSON.parse(sessionStorage.getItem('urthe'));
        }
        return 'http://uc.gfw-apis.appspot.com/urthecast/map-tiles/'+params.color_filter+'/{0}/{1}/{2}?cloud_coverage_lte={3}&acquired_gte={4}T00:00:00Z&acquired_lte={5}T00:00:00Z'.format(z, x, ll.y, params.cloud,params.mindate,params.maxdate);
      },
    };

    return new google.maps.ImageMapType(config);
  };

  return urthecastMaptype;
});

