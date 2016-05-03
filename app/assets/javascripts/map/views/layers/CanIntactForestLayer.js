/**
 * The IntactForest layer module.
 *
 * @return IntactForestLayer2013 class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/can_ifl.cartocss'
], function(CartoDBLayerClass, can_iflCartoCSS) {

  'use strict';

  var CanIntactForestLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}',
      cartocss: can_iflCartoCSS
    }

  });

  return CanIntactForestLayer;

});
