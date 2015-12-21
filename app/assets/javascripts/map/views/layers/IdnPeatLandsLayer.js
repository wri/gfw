
/**
 * idn_peat_lands
 *
 * @return ProtectedAreasCDBLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/idn_peat.cartocss'
], function(CartoDBLayerClass,idn_peatCartoCSS) {

  'use strict';

  var IdnPeatLandsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as tablename, \'{tableName}\' as layer FROM {tableName}',
      cartocss: idn_peatCartoCSS,
      infowindow: false,
      analysis: false,
      interactivity:'',
      raster: true,
      raster_band: 1
    },
  
  });

  return IdnPeatLandsLayer;

});