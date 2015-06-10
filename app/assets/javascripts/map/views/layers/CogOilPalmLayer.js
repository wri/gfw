/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CogOilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'cog_oil_palm\' as tablename, cartodb_id, the_geom_webmercator, type, id as name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, type, analysis',
      analysis: true
    }

  });

  return CogOilPalmLayer;

});