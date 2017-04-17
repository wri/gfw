/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanMiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_mining_1\' as tablename, cartodb_id, the_geom_webmercator, tenure_nam as name, round((shape_area::float)/10000) as area_ha, owner_ind as owner, tenure_num as permit_num, tenure_typ as type, record_dat as record_date, expiry_dat as expiry_date, province, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, area_ha, owner, permit_num, type, province, record_date, expiry_date, analysis',
      analysis: true
    }



  });

  return CanMiningLayer;

});
