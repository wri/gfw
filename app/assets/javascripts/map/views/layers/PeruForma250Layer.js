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

  var PeruForma250Layer = TorqueLayerClass.extend({

    options: {
      table: 'peru_250_daily',
      column: 'date',
      data_aggregation: 'cumulative',
      cartocss: CartoCSS
    }

  });

  return PeruForma250Layer;

});
