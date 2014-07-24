/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' as layer FROM {tableName}',
      infowindow: true,
      interactivity: 'name, country, national_legal_term, legal_recognition, area_ha, category'
    }

  });

  return LandRightsLayer;

});
