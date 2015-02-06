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
      sql: 'SELECT the_geom_webmercator, name, country, legal_term, legal_reco as legal_recognition, ROUND(area_ha::text::float) AS area_ha,  \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'name, country, legal_term, legal_recognition, area_ha'
    }

  });

  return LandRightsLayer;

});
