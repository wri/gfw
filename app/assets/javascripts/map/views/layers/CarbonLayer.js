/**
 * The BiodiversityHotspots layer module.
 *
 * @return BiodiversityHotspotsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CarbonLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, additional, country, estimated_, project_id, project_na, project_ur, proponent_, sectoral_s, project_pr,  {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'project_id, country, project_na, project_ur, project_pr, proponent_, estimated_, additional',
      analysis: false
    }

  });

  return CarbonLayer;

});