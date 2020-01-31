
/**
 * idn_peat_lands
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/idn_peat.cartocss',
], function(CartoDBLayerClass, idn_peatCartoCSS) {

  'use strict';

  var IdnPeatLandsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'{tableName}\' as tablename, layer_revi as name, cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, name, tablename, analysis',
      cartocss: idn_peatCartoCSS,
      analysis: true
    }

  
  });

  return IdnPeatLandsLayer;
  });






