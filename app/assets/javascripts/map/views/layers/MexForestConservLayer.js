/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MexForestSubCat.cartocss'
], function(CartoDBLayerClass,MexForestSubCatCartoCSS) {

  'use strict';
  var MexForestConservLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS tablename, \'{tableName}\' AS name FROM {tableName} where categoria = \'Zonas de conservación y aprovechamiento restringido o prohibido\'',
      analysis: false,
      infowindow: false,
      cartocss: MexForestSubCatCartoCSS
    }

  });

  return MexForestConservLayer;

});