/**
 * The Palm Oil mills layer module (copied from DamHotspotsLayer)
 * https://wri-01.carto.com/tables/oil_palm_mills
 * layerspec_nuclear_hazard cartodb_id 946
 * @return
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/palm_oil_mills.cartocss'
], function(CartoDBLayerClass, palm_oil_mills) {

  'use strict';

  var PalmOilMillsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, mill_name_ as name, group_name as pcompany, certificat as certification_status, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: ' name, pcompany, certification_status',
      analysis: false,
      cartocss: palm_oil_mills
    }

  });

  return PalmOilMillsLayer;

});
