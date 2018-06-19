/**
 * The Indonesian Forest Area layer module. (based on IdnPlantationsLayerBySpecies.js)
 * More info @ https://basecamp.com/3063126/projects/10726176/todos/303918841
 * @return IdnForestArea class (extends CartoDBLayerClass)
 */

//   'text!map/cartocss/IdnForestArea.cartocss'], function(CartoDBLayerClass, ) {

define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/IdnForestArea.cartocss'
], function(CartoDBLayerClass, IdnForestAreaCartocss) {

  'use strict';

  var IdnForestArea = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, fungsikawa, legend_en as name, cartodb_id, \'{tableName}\' AS tablename, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      cartocss: IdnForestAreaCartocss,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, layer, name, analysis',
      analysis: false
    }
  });

  return IdnForestArea;

});
