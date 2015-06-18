/**
 * The WWF layer module for use on canvas.
 *
 * @return WWFLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/bra_biomes.cartocss'
], function(CartoDBLayerClass, BraBiomesCartoCSS) {

  'use strict';

  var BraBiomesLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, name, (round(shape_area)*1000000) as area_ha, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, analysis',
      cartocss: BraBiomesCartoCSS,
      analysis: true
    }

  });

  return BraBiomesLayer;

});