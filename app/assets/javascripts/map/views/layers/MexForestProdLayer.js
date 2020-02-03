/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MexForestSubCat.cartocss'
], function(CartoDBLayerClass,MexForestSubCatCartoCSS) {

  'use strict';
  var MexForestProdLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS tablename, \'{tableName}\' AS name FROM {tableName} where categoria = \'Zonas de producción\'',
      analysis: false,
      infowindow: false,
      cartocss: MexForestSubCatCartoCSS
    }

  });

  return MexForestProdLayer;

});