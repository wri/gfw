/**
 * The LandsatAlerts layer module.
 *
 * @return LandsatAlertsLayer class (extends CartoDBLayerClass)
 */

define([
  'moment',
  'uri',
  'abstract/layer/TorqueLayerClass',
  'text!map/cartocss/LandsatAlertsTorque.cartocss',
  'map/presenters/layers/LandsatAlertsLayerPresenter'
], function(moment, UriTemplate, TorqueLayerClass, CartoCSS, Presenter) {

  'use strict';

  var LandsatAlertsLayer = TorqueLayerClass.extend({

    options: {
      table      : 'umd_alerts_agg',
      column     : 'date',
      data_aggregation: 'cumulative',
      resolution: 0.25,
      cartocss: CartoCSS
    }

  });

  return LandsatAlertsLayer;

});
