/**
 * The Azepoly layer module for use on canvas.
 *
 * @return AzepolyLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var AzepolyLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, sitenamefi as name, country, source, mapid, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'name, country, source, mapid'
    }

  });

  return AzepolyLayer;

});
