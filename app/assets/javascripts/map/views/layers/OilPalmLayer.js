/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var OilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'oilpalm\' as tablename, cartodb_id, the_geom_webmercator, name,company, type, country, area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company,country, type, area_ha, analysis',
      analysis: true
    }

  });

  return OilPalmLayer;

});
