  /**
 * The I mazon layer module.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/LandsatAlerts.cartocss',
], function(CartoDBLayerClass, LandsatAlertsCartoCSS) {

  'use strict';

  var LandsatAlertsLayer = CartoDBLayerClass.extend({
    options: {
      sql:  "select * from (SELECT cartodb_id, the_geom_webmercator, grid_code, to_char((date '2014-12-31' + grid_code::int),'mm/dd/yyyy') as dates, \'{tableName}\' as layer, \'{tableName}\' AS name FROM {tableName}) p",
      cartocss: LandsatAlertsCartoCSS,
      infowindow: true,
      interactivity: 'cartodb_id, dates'
    }
  });

  return LandsatAlertsLayer;

});
