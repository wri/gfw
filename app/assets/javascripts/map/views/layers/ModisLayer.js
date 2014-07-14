/**
 * The Modis layer module.
 *
 * @return ModisLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
  'text!cartocss/modis.cartocss'
], function(CartoDBLayerClass, modisCartoCSS) {

  'use strict';

  var ModisLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' AS layer FROM {tableName} WHERE EXTRACT(YEAR FROM date) = 2014 AND EXTRACT(MONTH FROM date) = 03 AND ST_Y(the_geom) < 37',
      cartocss: modisCartoCSS,
      interactivity: 'cartodb_id'
    }

  });

  return ModisLayer;

});
