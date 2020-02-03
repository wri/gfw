/**
 * mys_peat_lands
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mys_peat_lands.cartocss'
], function(CartoDBLayerClass, mys_peatCartoCSS) {

  'use strict';

  var MysPeatLandsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, layer_revi as name, cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, name, tablename, analysis',
      cartocss: mys_peatCartoCSS,
      analysis: true
    }
  
  });

  return MysPeatLandsLayer;
  });