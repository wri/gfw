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

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, data_type AS name FROM imazon_clean2'
    }

  });

  return ImazonLayer;

});
