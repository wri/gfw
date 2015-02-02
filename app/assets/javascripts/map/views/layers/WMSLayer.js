/**
 * The WMSLayer layer module.
 *
 * @return WMSLayerLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/honduras_forest.cartocss'
], function(CartoDBLayerClass, honduras_forestCartoCSS) {

  'use strict';

  var WMSLayerLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}',
      cartocss: honduras_forestCartoCSS
    }

  });

  return WMSLayerLayer;

});
