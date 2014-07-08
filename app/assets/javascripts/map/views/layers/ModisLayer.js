/**
 * The Modis layer module.
 *
 * @return ModisLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ModisLayer = CartoDBLayerClass.extend({
  });

  return ModisLayer;

});
