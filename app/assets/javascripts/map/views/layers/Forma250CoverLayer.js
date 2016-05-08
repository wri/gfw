/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return Forma250CoverLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/forma_250.cartocss'
], function(CartoDBLayerClass, CartoCSS) {

  'use strict';

  var Forma250CoverLayer = CartoDBLayerClass.extend({

    options: {
      cartocss: CartoCSS,
      sql: 'SELECT cartodb_id, the_geom, the_geom_webmercator, iso, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });

  return Forma250CoverLayer;

});
