/**
 * The Haiti Watershed User Data layer module.
 *
 * @return HaitiWatershed class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var HaitiWatershedLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' as tablename, area_ha, zone_1 as zone, nom as name , \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, area_ha, name, zone, analysis',
      analysis: true
    }



  });

  return HaitiWatershedLayer;

});
