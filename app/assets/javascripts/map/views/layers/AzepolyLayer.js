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
      sql: 'SELECT the_geom_webmercator,cartodb_id,\'{tableName}\' AS tablename,{analysis} AS analysis, sitenamefi as name, country, source, mapid, array_to_string(species::text[], \', \') as species, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, species, name, country, source, mapid, analysis',
      analysis: true
    }

  });

  return AzepolyLayer;

});
