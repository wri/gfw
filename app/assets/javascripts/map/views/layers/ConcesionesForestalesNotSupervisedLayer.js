/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return ConcesionesForestalesNotSupervised class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/concesiones_peruTypes.cartocss'
], function(CartoDBLayerClass,concesiones_forestalesCartoCSS) {

  'use strict';

  var ConcesionesForestalesNotSupervised = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}',
      cartocss: concesiones_forestalesCartoCSS
    }

  });

  return ConcesionesForestalesNotSupervised;

});
