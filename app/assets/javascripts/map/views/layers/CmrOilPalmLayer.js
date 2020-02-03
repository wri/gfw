/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CmrOilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cmr_oil_palm\' as tablename, cartodb_id, the_geom_webmercator,toponyme as name,sup_sig as area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      analysis: true
    }

  });

  return CmrOilPalmLayer;

});