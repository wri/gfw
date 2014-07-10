/**
 * The BiodiversityHotspots layer module.
 *
 * @return BiodiversityHotspotsLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var BiodiversityHotspotsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, image, description, name, photo_credit, \'%(tableName)s\' AS layer' +
        ' FROM %(tableName)s',
      infowindow: true,
      interactivity: 'image, description, name, photo_credit'
    }

  });

  return BiodiversityHotspotsLayer;

});
