/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var OilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, type, country, area_ha, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'country, type, area_ha, analysis',
      analysis: true
    }

  });

  return OilPalmLayer;

});
