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
      sql: 'SELECT cartodb_id||\':\' ||\'%(tableName)s\' as cartodb_id, the_geom_webmercator,' +
        '\'{tableName}\' AS layer FROM %(tableName)s',
      cartocss: modisCartoCSS,
      interactivity: 'cartodb_id'
    }

  });

  return ModisLayer;

});
