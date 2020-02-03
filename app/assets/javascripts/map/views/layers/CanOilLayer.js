/**
 * The Canadian Oil layer module (copied from the CanMiningLayer module originally).
 *
 * @return OilLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var CanOilLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'can_oil\' as tablename, cartodb_id, the_geom_webmercator, province, tenure_nam as name, tenure_num as permit_num, company as owner, tenure_typ as type, date_issue as date_issued, date_end as expiry_date, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}' ,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, owner, permit_num, type, province, date_issued, expiry_date, analysis',
      analysis: true
    }



  });

  return CanOilLayer;

});
