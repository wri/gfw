define([
  'd3', 'underscore', 'turf', 'geojsonArea'
], function(d3, _, turf, geojsonArea) {

  var geojsonUtilsHelper = {
    /**
     * Generates a GEOJSON form a path.
     *
     * @param  {Array} path Array of google.maps.LatLng objects
     * @return {string} A GeoJSON string representing the path
     */
    pathToGeojson: function(path) {
      var coordinates = null;

      coordinates = _.map(path, function(latlng) {
        return [
          _.toNumber(latlng.lng().toFixed(4)),
          _.toNumber(latlng.lat().toFixed(4))];
      });

      // First and last coordinate should be the same
      coordinates.push(_.first(coordinates));

      return {
        'type': 'Polygon',
        'coordinates': [coordinates]
      };
    },

    featureCollectionToFeature: function(geojson) {
      if (geojson.type === 'FeatureCollection') {
        return geojson.features.reduce(turf.union);
      } else {
        return {};
      }
    },

    /**
     * Generates a path from a Geojson.
     *
     * @param  {object} geojson
     * @return {array} paths
     */
    geojsonToPath: function(geojson) {
      if (geojson.type === 'Polygon') {
        var coords = geojson.coordinates[0];
        return _.map(coords, function(g) {
          return new google.maps.LatLng(g[1], g[0]);
        });
      } else if (geojson.type === 'MultiPolygon') {
        return geojson.coordinates.map(function(polygon) {
          return polygon[0].map(function(coords) {
            return new google.maps.LatLng(coords[1], coords[0]);
          });
        });
      } else if (geojson.type === 'FeatureCollection') {
        return this.geojsonToPath(
          this.featureCollectionToFeature(geojson).geometry);
      } else {
        return [];
      }
    },

    /**
     * Get Bounds from the suplied geojson.
     *
     * @param  {Object} geojson Topojson object
     * @return {Object} Returns google LatLngBounds object
     */
    getBoundsFromGeojson: function(geojson) {
      var d3bounds = d3.geo.bounds(geojson);

      if (_.isNaN(d3bounds[0][1]) || _.isNaN(d3bounds[0][0]) ||
        _.isNaN(d3bounds[1][1]) || _.isNaN(d3bounds[1][0])) {
        return null;
      }

      var a = new google.maps.LatLng(d3bounds[0][1], d3bounds[0][0]);
      var b = new google.maps.LatLng(d3bounds[1][1], d3bounds[1][0]);

      var bounds = new google.maps.LatLngBounds(a, b);
      return bounds;
    },

    /**
     * Get total hectares from a geojson.
     *
     * @param  {Object} geojson  polygon/multipolygon
     * @return {String} hectares
     */
    getHectares: function(geojson) {
      return Math.round((geojsonArea(geojson) / 10000)).toLocaleString();
      // changed function to calculate areas in cartodb instead of using the google library

      // var area;
      // var theurl="https://wri-01.carto.com/api/v2/sql";
      // var thequery="select st_area(st_geomfromgeojson('"+JSON.stringify(geojson)+"')::geography)/10000 as area_ha";
      // $.ajax({
      //    url: theurl,
      //    data: { q: thequery} ,
      //    success: function(result) {
      //                 area= Math.round(result.rows[0].area_ha).toLocaleString();
      //             },
      //    async:   false,
      //    method: 'POST'
      // });
      // return area;
    }

  };

  return geojsonUtilsHelper;

});
