/**
 * The IntactForest layer module.
 *
 * @return IntactForestLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IntactForestLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}'
    },

  });

  return IntactForestLayer;

});
