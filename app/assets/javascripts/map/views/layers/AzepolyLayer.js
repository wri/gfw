/**
 * The Azepoly layer module for use on canvas.
 *
 * @return AzepolyLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var AzepolyLayer = CartoDBLayerClass.extend({
    options: {
      sql: 'SELECT the_geom_webmercator, sitenamefi as name, country, source, mapid, array_to_string(species, \', \') as species, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'species, name, country, source, mapid'
    }

  });

  return AzepolyLayer;

});
