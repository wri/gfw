define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var GladCoverageLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM glad_coverage_1'
    }

  });
  
  return GladCoverageLayer;

});
