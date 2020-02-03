/**
 * The BiodiversityHotspots layer module.
 *
 * @return BiodiversityHotspotsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/dam_hotspots.cartocss'
], function(CartoDBLayerClass,dam_hotspots) {

  'use strict';

  var DamHotspotsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, basin_name, project as project_name, capacity, rivers, status, campaign as project_ur,  {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: ' basin_name, project_name, capacity, rivers, status, project_ur',
      analysis: false,
      cartocss: dam_hotspots
    }

  });

  return DamHotspotsLayer;

});
