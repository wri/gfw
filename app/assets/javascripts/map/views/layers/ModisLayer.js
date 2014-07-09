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
      cartocss: modisCartoCSS
    }

  });

  return ModisLayer;

});
