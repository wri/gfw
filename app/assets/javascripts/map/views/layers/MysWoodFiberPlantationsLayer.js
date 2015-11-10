/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MysWoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, name_of_gr as company, source_of as source, to_char(permit_dat,'DD/MM/YYYY') as permit_date, round(area_offic::float) as area_ha, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}",
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, source, company, permit_date, area_ha, analysis',
      analysis: true
    }

  });

  return MysWoodFiberPlantationsLayer;

});