/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/perPA.cartocss'
], function(CartoDBLayerClass, PerPACartoCSS) {

  'use strict';

  var PerPALayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, ANP_NOMB as name, category, type, fecha as date_created, anpc_titu as owner, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, category, type, date_created, owner, analysis',
      analysis: true,
      cartocss: PerPACartoCSS
    }

  });

  return PerPALayer;

});