/**
 * The ProtectedAreasCDB layer module.
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/drc_primary_forest.cartocss'
], function(CartoDBLayerClass,drc_primary_forestCartoCSS) {

  'use strict';

  var DrcPrimaryForestLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as tablename, \'{tableName}\' as layer FROM {tableName}',
      cartocss: drc_primary_forestCartoCSS,
      infowindow: false,
      analysis: false,
      interactivity:'',
      raster: true,
      raster_band: 1
    },
  
  });

  return DrcPrimaryForestLayer;

});