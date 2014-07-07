/**
 * The analysis module.
 *
 * To get analysis results from this module, first subscribe to the
 * 'analysis/get-results' topic
 * To get analysis results, publish the 'analysis/get' event and pass in a
 * config object with analysis parameters:
 *
 *
 */
define([
  'underscore',
  'nsa',
  'Class',
  'uri'
], function (_, nsa, Class, UriTemplate) {

  'use strict';

  var AnalysisService = Class.extend({

    // TODO: pull this from /forest-change endpoint and cache.
    apis: {
      'forma-alerts': {
        'apis': {
          'national': 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/{iso}{?period,bust,dev}',
          'subnational': 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/{iso}/{id1}{?period,bust,dev}',
          'use': 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/use/{use}/{useid}{?period,bust,dev}',
          'wdpa': 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/wdpa/{wdpaid}{?period,bust,dev}'
        }
      },
      'nasa-active-fires': {
        'apis': {
          'national': 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/{iso}{?period,bust,dev}',
          'subnational': 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/{iso}/{id1}{?period,bust,dev}',
          'use': 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/use/{use}/{useid}{?period,bust,dev}',
          'wdpa': 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/wdpa/{wdpaid}{?period,bust,dev}'
        }
      },
      'quicc-alerts': {
        'apis': {
          'national': 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/{iso}{?period,bust,dev}',
          'subnational': 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/{iso}/{id1}{?period,bust,dev}',
          'use': 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/use/{use}/{useid}{?period,bust,dev}',
          'wdpa': 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/wdpa/{wdpaid}{?period,bust,dev}'
        }
      },      
      'umd-loss-gain':{
        'apis':{
          'national': 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}{?bust,dev,thresh}',
          'subnational': 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}/{id1}{?bust,dev,thresh}'
        }
      }
    },

    init: function() {
    },

    /**
     * Return URI template for API based on supplied config object of 
     * parameters. The dataset config property is required.
     *
     * @param  {object} API parameters
     * @return {string} URI template for API
     */
    _getUriTemplate: function(config) {
      var dataset = config.dataset;

      if (!dataset) {
        return null;
      }

      if (_.has(config, 'iso') && !_.has(config, 'id1')) {
        return this.apis[dataset].apis.national;
      } else if (_.has(config, 'iso') && _.has(config, 'id1')) {
        return this.apis[dataset].apis.subnational;
      } else if (_.has(config, 'use')) {
        return this.apis[dataset].apis.use;
      } else if (_.has(config, 'wdpaid')) {
        return this.apis[dataset].apis.wdpa;
      } 

      return null;
    },

    /**
     * Returns API URL from supplied config object of API parameters.
     *
     * @param  {object} config API parameters
     * @return {string} API URL
     */
    _getUrl: function(config) {
      var template = this._getUriTemplate(config);
      var url = null;

      if (!template) {
        return null;
      }

      url = new UriTemplate(template).fillFromObject(config);

      return url;
    },

    /**
     * Asynchronously execute analysis for supplied configuration.
     *
     * @param  {Object} config object
     *   dataset - layer name (e.g., forma-alerts, umd-loss-gain)
     *   period - beginyear,endyear (e.g., 2001,2002)
     *   download - filename.format (e.g., forma.shp)
     *   geojson - GeoJSON Polygon or Multipolygon
     *   iso - 3 letter country ISO code (e.g., BRA)
     *   id1 - GADM subational id (e.g., 3445)
     *   use - Concession name (e.g., logging, mining, oilpalm, fiber)
     *   useid - Concession polygon cartodb_id (e.g., 2)
     *   wdpaid - WDPA polygon cartodb_id (e.g., 800)
     */
    execute: function(config, successCb, failureCb) {
      var url = this._getUrl(config);

      if (!url) {
        failureCb('Unable to find API endpoint for supplied config');
        return;
      }

      nsa.spy(
        url,
        {},
        function(response) {
          successCb(response);
        },
        function(responseText, status, error) {
          failureCb(responseText, status, error);
        });
    }
  });

  var service = new AnalysisService();

  return service;
});
