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
      sql: 'SELECT the_geom_webmercator,cartodb_id, ebaaltmin::text, ebaaltmax, ebabookcod as id, ebaname, factsheet, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, ebaname, ebaaltmin, ebaaltmax, factsheet, analysis',
      analysis: true
    }

  });

  return BirdlifeLayer;

});
