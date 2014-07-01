/**
 * The Imazon layer module for use on canvas.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ImazonLayer = CartoDBLayerClass.extend({

    init: function(layer) {
      this._super(layer);
      this.url = 'dyynnn89u7nkm.cloudfront.net';
      this.table = 'imazon_clean2';
      this.global_version = 6;
    }

  });

  return ImazonLayer;

});
