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
      table      : 'gfw_landsat_alerts_wkb_short',
      column     : 'date',
      data_aggregation: 'cumulative',
      cartocss: CartoCSS
    }

  });

  return LandsatAlertsLayer;

});
