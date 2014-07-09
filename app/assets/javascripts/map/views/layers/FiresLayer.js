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

    options: {
      sql: 'SELECT * FROM global_7d',
      cartocss: global7dCartoCSS,
      interactivity: 'acq_time, acq_date, confidence, brightness, longitude, latitude',
      infowindow: true
    }

  });

  return FiresLayer;

});
