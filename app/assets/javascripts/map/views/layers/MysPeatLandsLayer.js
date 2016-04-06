/**
 * mys_peat_lands
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/idn_peat.cartocss'
], function(CartoDBLayerClass, mys_peatCartoCSS) {

  'use strict';

  var MysPeatLandsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, layer_revi, cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: false,
      interactivity: 'cartodb_id, tablename',
      cartocss: mys_peatCartoCSS,
      analysis: true
    }
  
  });

  return MysPeatLandsLayer;
  });