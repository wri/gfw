define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GladCoverageLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });
  
  return GladCoverageLayer;

});
