/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LbrOilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'lbr_oil_palm\' as tablename, cartodb_id, the_geom_webmercator, group_comp as company, name, area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: false
    }

  });

  return LbrOilPalmLayer;

});