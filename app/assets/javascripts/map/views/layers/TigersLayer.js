/**
 * The Tiger layer module for use on canvas.
 *
 * @return TigersLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/tigerCartoCSS.cartocss'
], function(CartoDBLayerClass, TigerCartoCSS) {

  'use strict';

  var TigersLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, the_geom, tcl_name as name, area_ha, tx2_tcl, \'tiger_conservation_landscapes\' AS tablename, \'tiger_conservation_landscapes\' as layer, {analysis} AS analysis '+

        'FROM tiger_conservation_landscapes '+

        'UNION '+
        'SELECT the_geom_webmercator, cartodb_id, the_geom, name,  area_ha, area_ha as tx2_tcl, \'tal_corridor\' AS tablename, \'tal_corridor\' as layer, {analysis} AS analysis '+
        'FROM tal_corridor ',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, name, area_ha, analysis',
      analysis: true,
      cartocss: TigerCartoCSS
    }
  });

  return TigersLayer;

});
