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
      sql: 'SELECT the_geom_webmercator, the_geom, nombre as name, cartodb_id, cat_manejo as category, superficie as original_size_h, prim_dec as date_create, tipo, vigencia as validity, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, original_size_h, date_create, tipo, validity, analysis',
      analysis: true,
      cartocss: mexicanPA
    },

  });

  return MexicanProtectedAreasLayer;

});
