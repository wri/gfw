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
  'Class',
  'services/DataService',
  '_string'
], function (_, Class, ds) {

  'use strict';

  var URL = 'http://beta.gfw-apis.appspot.com/forest-change';

  var AnalysisService = Class.extend({

    /**
     * Returns analysis API urls for supplied dataset.
     * 
     * @param  {string} dataset The dataset
     * @return {object} Object with ids mapping to urls
     */
    _urls: function(dataset) {
      var types = ['world', 'national', 'subnational', 'use', 'wdpa'];
      var ids = _.map(types,
        function(type) {
          return  _.str.sprintf('%s:%s', dataset, type);
        });
      var urls = [
        _.str.sprintf('%s/%s', URL, dataset),
        _.str.sprintf('%s/%s/admin/{iso}', URL, dataset),
        _.str.sprintf('%s/%s/admin/{iso}/{id1}', URL, dataset),
        _.str.sprintf('%s/%s/use/{use}/{useid}', URL, dataset),
        _.str.sprintf('%s/%s/wdpa/{wdpaid}', URL, dataset)
      ];

      return _.object(ids, urls);
    },

    /**
     * Constructs a new instance of AnalysisService.
     * 
     * @return {AnalysisService} instance
     */
    init: function() {
      this._defineRequests();
    },

    /**
     * Defines all API requests used by AnalysisService.
     */
    _defineRequests: function() {
      var datasets = [
        'forma-alerts', 'umd-loss-gain', 'imazon-alerts', 'nasa-active-fires', 
        'quicc-alerts'
      ];

      _.each(datasets, function(dataset) {
        _.each(this._urls(dataset), function(url, id) {
          var cache = {duration: 1, unit: 'days'};
          var config = {
            cache: cache, url: url, type: 'POST', dataType: 'json'};
          ds.define(id, config);
        }, this);
      }, this);
    },

    /**
     * Returns the request id dataset:type for supplied request config.
     * 
     * @param  {object} config The request config object.
     * @return {[type]} The request id
     */
    _getId: function(config) {
      var dataset = config.dataset;

      if (!dataset) {
        return null;
      }

      if (_.has(config, 'iso') && !_.has(config, 'id1')) {
        return _.str.sprintf('%s:national', dataset);
      } else if (_.has(config, 'iso') && _.has(config, 'id1')) {
        return _.str.sprintf('%s:subnational', dataset);
      } else if (_.has(config, 'use')) {
        return _.str.sprintf('%s:use', dataset);
      } else if (_.has(config, 'wdpaid')) {
        return _.str.sprintf('%s:wdpa', dataset);
      } else if (_.has(config, 'geojson')) {
        return _.str.sprintf('%s:world', dataset);
      }

      return null;
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
    execute: function(data, successCb, failureCb) {
      var id = this._getId(data);
      var config = {resourceId: id, data: data, success: successCb,
        error: failureCb};

      ds.request(config);
    }
  });

  var service = new AnalysisService();

  return service;
});
