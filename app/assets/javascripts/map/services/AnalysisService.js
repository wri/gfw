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
  'jquery',
  'underscore',
  'mps',
  'nsa',
  'Class',
  'uri'
], function ($, _, mps, nsa, Class, UriTemplate) {

  'use strict';

  var AnalysisService = Class.extend({

    // URI templates for API
    apis: {
      national: 'http://{host}/forest-change/{dataset}/admin{/iso}{?period,download,bust,dev,thresh}',
      subnational: 'http://{host}/forest-change/{dataset}/admin{/iso}{/id1}{?period,download,bust,dev,thresh}',
    },

    init: function() {
    },

    /**
     * Return URI template for API based on supplied config object of parameters.
     *
     * @param  {object} API parameters
     * @return {string} URI template for API
     */
    _getUriTemplate: function(config) {
      if (_.has(config, 'iso') && !_.has(config, 'id1')) {
        return this.apis.national;
      } else if (_.has(config, 'iso') && _.has(config, 'id1')) {
        return this.apis.subnational;
      } else if (_.has(config, 'use')) {
        return this.apis.use;
      } else if (_.has(config, 'wdpa')) {
        return this.apis.wdpa;
      } else {
        return this.apis.global;
      }
    },

    /**
     * Gets the API host.
     *
     * @return {string} the API host
     */
    get_api_host: function() {
      // return 'localhost:8080';
      return 'beta.gfw-apis.appspot.com';
    },

    /**
     * Returns API URL from supplied config object of API parameters.
     *
     * @param  {object} config API parameters
     * @return {string} API URL
     */
    _getUrl: function(config) {
      var template = this._getUriTemplate(config);
      var host = this.get_api_host();
      var url = null;

      config.host = host;
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
     *   wdpa - WDPA polygon cartodb_id (e.g., 800)
     */
    execute: function(config, successCb, failureCb) {
      var url = this._getUrl(config);

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
