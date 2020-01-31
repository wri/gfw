/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MexForestSubCat.cartocss'
], function(CartoDBLayerClass,MexForestSubCatCartoCSS) {

  'use strict';
  var MexForestSubCatLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS tablename, \'{tableName}\' AS name FROM {tableName}',
      analysis: false,
      infowindow: false,
      cartocss: MexForestSubCatCartoCSS
    }

  });

  return MexForestSubCatLayer;

});