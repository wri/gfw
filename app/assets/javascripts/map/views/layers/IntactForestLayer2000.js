/**
 * The IntactForest layer module.
 *
 * @return IntactForestLayer2000 class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IntactForestLayer2000 = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}'
    },

  });

  return IntactForestLayer2000;

});
