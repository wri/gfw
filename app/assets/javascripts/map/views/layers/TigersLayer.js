/**
 * The Tiger layer module for use on canvas.
 *
 * @return TigersLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass'
], function(CartoDBLayerClass, TigerCartoCSS) {

  'use strict';

  var TigersLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, the_geom, tcl_name as name, area_ha, tx2_tcl as type, tcl AS layer FROM tcl '
    }

  });

  return TigersLayer;

});
