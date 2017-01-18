/**
 * The Pakistan User Data Mangrove layer module.
 *
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/BolUserFireFreq.cartocss',
], function(CartoDBLayerClass,BolUserFireFreqCartocss) {

  'use strict';

  var BolUserFireFrequencyLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, fire_freq, id, rep, {analysis} AS analysis, \'{tableName}\' AS tablename, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, fire_freq, id, rep, analysis',
      analysis: false,
      cartocss: BolUserFireFreqCartocss,
    }

  });

  return BolUserFireFrequencyLayer;

});
