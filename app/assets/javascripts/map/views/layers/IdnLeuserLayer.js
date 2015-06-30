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
      sql: 'SELECT \'idn_leuser\' as tablename, cartodb_id, the_geom_webmercator, name, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, analysis',
      analysis: true
    }

  });

  return IdnLeuserLayer;

});
