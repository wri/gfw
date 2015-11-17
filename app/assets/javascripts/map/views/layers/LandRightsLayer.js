/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: "with gfw_land_rights_1 as (SELECT cartodb_id, the_geom_webmercator, name, category, doc_status , country, data_src FROM gfw_land_rights_1 union SELECT (cartodb_id+100000) as cartodb_id, the_geom_webmercator, name, category, doc_status, country, data_src FROM gfw_land_rights_pt) select cartodb_id, the_geom_webmercator, name, category, doc_status, country, data_src source, 'gfw_land_rights_1' AS tablename, 'gfw_land_rights_1' as layer, {analysis} AS analysis from gfw_land_rights_1",
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, name, country, source, doc_status, analysis',
      analysis: true
    }

  });

  return LandRightsLayer;

});
