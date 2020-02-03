/**
 * The Indonesia Leuser layer module.
 *
 * @return IdnLeuserLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnLeuserLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'leuser_ecosystem_province_boundary\' as tablename, cartodb_id, the_geom_webmercator, name,  round(area_ha::float) as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      analysis: true
    }

  });

  return IdnLeuserLayer;

});
