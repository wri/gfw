/**
 * The ResourceRights layer module.
 *
 * @return ResourceRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, name, country, area_hectares, national_legal_term, legal_recognition, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'country, name, area_hectares, national_legal_term, legal_recognition'
    }

  });

  return ResourceRightsLayer;

});
