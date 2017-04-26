/**
 * Forma activity layer module.
 *
 * @return FormaDaiñly class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/FormaActivity.cartocss'
], function(CartoDBLayerClass, FormaDailyCartocss) {

  'use strict';

  var FormaActivityLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT *, \'{tableName}\' as tablename,\'{tableName}\' AS layer FROM {tableName}",
      infowindow: false,
      analysis: false,
      cartocss: FormaDailyCartocss,
      interactivity: 'cartodb_id'
    }
  });

  return FormaActivityLayer;

});
