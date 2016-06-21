/**
 * The MexicanProtectedAreas layer module.
 *
 * @return MexicanProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mexicanPA.cartocss'
], function(CartoDBLayerClass,mexicanPA) {

  'use strict';

  var MexicanProtectedAreasLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, the_geom, nombre as name, cartodb_id, cat_manejo as category, superficie as area_ha, prim_dec as date, vigencia as validity, tipo, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, area_ha, date, validity, tipo, analysis',
      analysis: true,
      cartocss: mexicanPA
    },

  });

  return MexicanProtectedAreasLayer;

});
