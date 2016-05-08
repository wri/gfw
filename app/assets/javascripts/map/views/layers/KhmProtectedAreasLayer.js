/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var KhmProtectedAreasLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, name, round(size_ha) as area_ha, category, to_char(issuedate, 'MM/DD/YYYY') as date_create, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}" ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, date_create, area_ha, analysis',
      analysis: true
    }
    


  });

  return KhmProtectedAreasLayer;

});
