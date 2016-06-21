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
      sql: 'SELECT the_geom_webmercator, the_geom, nombre as name, cartodb_id, cat_manejo as category, round(superficie) as area_ha, to_char(prim_dec,\'DD Mon YYYY\') as date_create, vigencia as validity, tipo as type, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, area_ha, date_create, validity, type, analysis',
      analysis: true,
      cartocss: mexicanPA
    },

  });

  return MexicanProtectedAreasLayer;

});
