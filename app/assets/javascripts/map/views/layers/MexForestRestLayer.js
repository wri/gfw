/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MexForestSubCat.cartocss'
], function(CartoDBLayerClass,MexForestSubCatCartoCSS) {

  'use strict';
  var MexForestRestLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS tablename, \'{tableName}\' AS name FROM {tableName} where categoria = \'Zonas de restauración\'',
      analysis: false,
      infowindow: false,
      cartocss: MexForestSubCatCartoCSS
    }

  });

  return MexForestRestLayer;

});