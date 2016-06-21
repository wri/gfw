/**
 * The MexicanProtectedAreas layer module.
 *
 * @return MexicanProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mexicanPA.cartocss'
], function(CartoDBLayerClass) {

  'use strict';

  var MexicoPaymentsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, the_geom, cartodb_id, type, tipo_solic, ano, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, type, tipo_solic, ano, analysis',
      analysis: true
    },

  });

  return MexicoPaymentsLayer;

});
