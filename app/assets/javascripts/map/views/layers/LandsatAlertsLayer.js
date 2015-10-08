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
      sql:  'SELECT cartodb_id, the_geom_webmercator, grid_code, \'{tableName}\' as layer, \'{tableName}\' AS name FROM {tableName} ',
      cartocss: LandsatAlertsCartoCSS
    }
  });

  return LandsatAlertsLayer;

});