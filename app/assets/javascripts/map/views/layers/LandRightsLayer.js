/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator,name, country, national_legal_term, legal_recognition, ROUND(area_ha) AS area_ha, category,  \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'name, country, national_legal_term, legal_recognition, area_ha, category'
    }

  });

  return LandRightsLayer;

});
