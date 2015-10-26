/**
 * The LandsatAlerts layer module.
 *
 * @return LandsatAlertsLayer class (extends CartoDBLayerClass)
 */

define([
  'moment',
  'uri',
  'abstract/layer/TorqueLayerClass',
  'text!map/cartocss/LandsatAlerts.cartocss',
  'map/presenters/layers/LandsatAlertsLayerPresenter'
], function(moment, UriTemplate, TorqueLayerClass, LandsatAlertsCartoCSS, Presenter) {

  'use strict';

  var LandsatAlertsLayer = TorqueLayerClass.extend({

    options: {
      table      : 'gfw_landsat_alerts',
      column     : 'grid_code',
      data_aggregation: 'cumulative'
    }

  });

  return LandsatAlertsLayer;

});
