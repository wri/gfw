// Geojson to area port from:
// https://github.com/mapbox/geojson-area
(function() {

  'use strict'

  function geojsonArea(geom) {
    if (geom.type === 'Polygon') return polygonArea(geom.coordinates);
    else if (geom.type === 'MultiPolygon') {
      var area = 0;
      for (var i = 0; i < geom.coordinates.length; i++) {
        area += polygonArea(geom.coordinates[i]);
      }
      return area;
    } else {
      return null;
    }
  }

  function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
      area += Math.abs(ringArea(coords[0]));
      for (var i = 1; i < coords.length; i++) {
        area -= Math.abs(ringArea(coords[i]));
      }
    }
    return area;
  }

  /**
   * Calculate the approximate area of the polygon were it projected onto
   *     the earth.  Note that this area will be positive if ring is oriented
   *     clockwise, otherwise it will be negative.
   *
   * Reference:
   * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
   *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
   *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
   *
   * Returns:
   * {float} The approximate signed geodesic area of the polygon in square
   *     meters.
   */
  function ringArea(coords) {
    var area = 0;

    if (coords.length > 2) {
      var p1, p2;
      for (var i = 0; i < coords.length - 1; i++) {
        p1 = coords[i];
        p2 = coords[i + 1];
        area += rad(p2[0] - p1[0]) * (2 + Math.sin(rad(p1[1])) + Math.sin(rad(p2[1])));
      }
      // wgs84 radius = 6378137
      area = area * 6378137 * 6378137 / 2;
    }

    return area;
  }

  function rad(_) {
    return _ * Math.PI / 180;
  }

  if (typeof define === 'function' && define.amd) {
    define('geojsonArea', [], function() {
      return geojsonArea;
    });
  } else {
    this.geojsonArea = geojsonArea;
  }

}).call(this);
