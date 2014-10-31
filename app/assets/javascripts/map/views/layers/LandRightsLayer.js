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
      sql: 'SELECT the_geom_webmercator,name, country, legal_term, recognized, ROUND(area_ha::text::float) AS area_ha, category,  \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'name, country, legal_term, recognized, area_ha, category'
    }

  });

  return LandRightsLayer;

});
