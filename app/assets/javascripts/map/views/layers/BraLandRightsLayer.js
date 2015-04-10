/**
 * The LandRights layer module.
 *
 * @return LandRightsLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var BraLandRightsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'bra_land_rights\' as tablename, cartodb_id, the_geom_webmercator, name, nat_leg_te as national_legal_term, leg_rec as legal_recognition,  \'{tableName}\' as layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, name, national_legal_term, legal_recognition, analysis',
      analysis: false
    }

  });

  return BraLandRightsLayer;

});