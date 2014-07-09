/**
 * The Fires layer module.
 *
 * @return FiresLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
  'text!cartocss/global_7d.cartocss'
], function(CartoDBLayerClass, global7dCartoCSS) {

  'use strict';

  var FiresLayer = CartoDBLayerClass.extend({

    cartocss: global7dCartoCSS

  });

  return FiresLayer;

});
