/**
 * The IntactForest layer module.
 *
 * @return IntactForestLayer2013 class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/intact2013.cartocss'
], function(CartoDBLayerClass, intact2013CartoCSS) {

  'use strict';

  var IntactForestLayer2013 = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}',
      cartocss: intact2013CartoCSS
    }

  });

  return IntactForestLayer2013;

});
