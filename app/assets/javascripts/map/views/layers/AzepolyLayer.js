/**
 * The Azepoly layer module for use on canvas.
 *
 * @return AzepolyLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var AzepolyLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });

  return AzepolyLayer;

});
