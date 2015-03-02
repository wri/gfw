/**
 * The Birdlife layer module for use on canvas.
 *
 * @return BirdlifeLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var BirdlifeLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, ebarecid as id, ebaname, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'ebaname, id'
    }

  });

  return BirdlifeLayer;

});
