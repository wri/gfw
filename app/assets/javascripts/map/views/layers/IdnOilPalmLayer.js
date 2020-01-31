/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IdnOilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'idn_oil_palm\' as tablename, cartodb_id, the_geom_webmercator, name, area_ha, company, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, area_ha, analysis',
      analysis: true
    }

  });

  return IdnOilPalmLayer;

});