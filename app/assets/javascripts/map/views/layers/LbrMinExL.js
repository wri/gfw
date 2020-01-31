/**
 * The WWF layer module for use on canvas.
 *
 * @return WWFLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/lbr_mining.cartocss'
], function(CartoDBLayerClass, BraBiomesCartoCSS) {

  'use strict';

  var LbrMinExLLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, hectares::numeric as area_ha, datesign, source, resources, contractsi, duration, contractst, agency, pcompcount, pcompany, company, title as name, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, datesign, source, resources, contractsi, duration, contractst, agency, pcompcount, pcompany, company, area_ha, analysis',
      cartocss: BraBiomesCartoCSS,
      analysis: true
    }

  });

  return LbrMinExLLayer;

});