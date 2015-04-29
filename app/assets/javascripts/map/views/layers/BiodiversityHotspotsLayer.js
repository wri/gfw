/**
 * The BiodiversityHotspots layer module.
 *
 * @return BiodiversityHotspotsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var BiodiversityHotspotsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, image, descriptio as description, name,photo_cred as photo_credit, {analysis} AS analysis, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'image, description, name, photo_credit, analysis',
      analysis: false
    }

  });

  return BiodiversityHotspotsLayer;

});
