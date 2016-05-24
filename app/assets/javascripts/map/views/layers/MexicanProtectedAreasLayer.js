/**
 * The MexicanProtectedAreas layer module.
 *
 * @return MexicanProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MexicanProtectedAreasLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, the_geom, nombre as name, cartodb_id, cat_magenjo as category, superficie as surface, prim_dec as date_create, tipo as type, vigencia as validity, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, surface, date_create, type, validity, analysis',
      analysis: true,
    },

  });

  return MexicanProtectedAreasLayer;

});
