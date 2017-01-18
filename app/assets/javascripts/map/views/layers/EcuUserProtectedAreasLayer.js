/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var EcuUserProtectedAreasLayer = CartoDBLayerClass.extend({

    options: {
      sql: "SELECT \'{tableName}\' as tablename, cartodb_id, the_geom_webmercator, contact, area_ha, date_crea AS date_created, data_cite as citation, data_funct, data_sourc as source, iucn_cat, name, geog_cover, legal_des, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}" ,
      infowindow: true,
      interactivity: 'cartodb_id, contact, area_ha, data_funct, citation, source, name, geog_cover, legal_des, analysis, iucn_cat, date_created',
      analysis: true
    }
    


  });

  return EcuUserProtectedAreasLayer;

});
