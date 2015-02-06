/**
 * The ResourceRights layer module.
 *
 * @return ResourceRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var ResourceRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, name, country, round(area_ha::float) as area_ha, legal_term, legal_reco as legal_recognition, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'country, name, area_ha, legal_term, legal_recognition'
    }

  });

  return ResourceRightsLayer;

});
