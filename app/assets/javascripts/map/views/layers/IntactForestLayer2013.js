/**
 * The IntactForest layer module.
 *
 * @return IntactForestLayer2013 class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var IntactForestLayer2013 = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer, \'{tableName}\' as name FROM {tableName}'
    },

  });

  return IntactForestLayer2013;

});
