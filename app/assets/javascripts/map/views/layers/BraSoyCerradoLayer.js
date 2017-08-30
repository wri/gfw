/**
 * The Brazil Soy Cerrado layer module.
 *
 * @return SoyCerradoLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var BraSoyCerradoLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as tablename, \'{tableName}\' as layer FROM {tableName}',
      infowindow: false,
      interactivity: '',
      analysis: false
    }

  });

  return BraSoyCerradoLayer;

});
