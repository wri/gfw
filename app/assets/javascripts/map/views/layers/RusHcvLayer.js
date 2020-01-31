/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/Rus_Hcv.cartocss'
], function(CartoDBLayerClass, Rus_HcvCartocss) {

  'use strict';

  var RusHcvLayer = CartoDBLayerClass.extend({

    options: {
      sql: "with rushcv as (SELECT cartodb_id, the_geom_webmercator, area_ha, 'Predominance of pine and larch' as cat FROM tracts_with_a_predominance_of_pine_and_larch union SELECT (cartodb_id+100) as cartodb_id, the_geom_webmercator, area_ha, 'Predominance of larch' as cat FROM tracts_with_a_predominance_of_larch union SELECT (cartodb_id+200) as cartodb_id, the_geom_webmercator, area_ha, 'Predominance of dark coniferous species' as cat  FROM tracts_with_a_predominance_of_dark_coniferous_species) SELECT cartodb_id, the_geom_webmercator, area_ha, cat, 'rushcv' AS tablename, 'rushcv' AS layer, {analysis} AS analysis FROM rushcv",
      infowindow: true,
      interactivity: 'cartodb_id, tablename, area_ha, layer, analysis',
      analysis: true,
      cartocss: Rus_HcvCartocss,
    }

  });

  return RusHcvLayer;

});