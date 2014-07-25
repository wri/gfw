/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return FormaCoverLayer class (extends CanvasLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ModisCoverLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom AS the_geom_webmercator, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });

  return ModisCoverLayer;

});
