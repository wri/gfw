/**
 * The ProtectedAreasCDB layer module.
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/per_minam_cover.cartocss'
], function(CartoDBLayerClass,per_minam_coverCartoCSS) {

  'use strict';

  var PerMinamCoverLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as tablename, \'{tableName}\' as layer FROM {tableName}',
      cartocss: per_minam_coverCartoCSS,
      infowindow: false,
      analysis: false,
      interactivity:'',
      raster: true,
      raster_band: 1
    },
  
  });

  return PerMinamCoverLayer;

});