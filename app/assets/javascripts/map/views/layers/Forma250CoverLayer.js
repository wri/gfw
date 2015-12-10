/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return Forma250CoverLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var Forma250CoverLayer = CartoDBLayerClass.extend({

    options: {
      cartocss: '#layer { polygon-fill: #FF6699; polygon-opacity: 0.2; line-width: 0; }',
      sql: 'SELECT cartodb_id, the_geom, the_geom_webmercator, iso, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });

  return Forma250CoverLayer;

});
