/*
 * This cover cartodb layers
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/MexForestCat.cartocss'
], function(CartoDBLayerClass,MexForestCatCartoCSS) {

  'use strict';
  var MexForestCatLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS tablename, \'{tableName}\' AS name FROM {tableName}',
      analysis: false,
      infowindow: false,
      cartocss: MexForestCatCartoCSS
    }

  });

  return MexForestCatLayer;

});
