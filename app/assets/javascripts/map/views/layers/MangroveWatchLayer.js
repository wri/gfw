/**
 * The Mangrove Watch layer module for use on canvas.
 *
 * @return MangroveWatchLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MangroveWatch.cartocss'
], function(CartoDBLayerClass, MangroveWatchCarto) {

  'use strict';

  var MangroveWatchLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}',
      cartocss: MangroveWatchCarto
    }

  });

  return MangroveWatchLayer;

});
