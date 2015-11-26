/**
 * The FORMA 250 layer module.
 *
 * @return Forma250Layer class (extends TorqueLayerClass)
 */

define([
  'abstract/layer/TorqueLayerClass',
  'text!map/cartocss/Forma250Layer.cartocss'
], function(TorqueLayerClass, CartoCSS) {

  'use strict';

  var BrazilForma250Layer = TorqueLayerClass.extend({

    options: {
      table: 'brazil_250_daily',
      column: 'date',
      data_aggregation: 'cumulative',
      cartocss: CartoCSS
    }

  });

  return BrazilForma250Layer;

});
