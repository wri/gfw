/*eslint-disable*/
/**
 * The AnalysisService module for interacting with the GFW Analysis API.
 *
 * To use this service, you can inject it directly and call the execute()
 * function. The preferred way is to use events to keep the app decoupled
 * and testable.
 *
 * To do analysis with events, first subscribe:
 *
 *   mps.subscribe('AnalysisService/results', function(results) {...});
 *
 * Then you can do an analysis by publishing:
 *
 *   mps.publish('AnalysisService/get', [config]);
 *
 *  See the execute() function docs for information about the config,
 *  success, and failure arguments.
 */
define(
  ['underscore', 'Class', 'map/services/DataService', 'mps', '_string'],
  function(_, Class, ds, mps) {
    'use strict';

    var URL = window.gfw.config.GFW_API;

    var AnalysisService = Class.extend({
      /**
       * Constructs a new instance of AnalysisService.
       *
       * @return {AnalysisService} instance
       */
      init: function() {
        this._defineRequests();
        this._subscribe();
        this._currentRequest = null;
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
        var success = _.bind(function(results) {
          mps.publish('AnalysisService/results', [results]);
          if (successCb) {
            successCb(results.data.attributes);
          }
        }, this);

        var failure = _.bind(function(t, a) {
          if (a === 'abort') {
            return;
          }
          var results = { failure: a };
          mps.publish('AnalysisService/results', [results]);
          if (failureCb) {
            failureCb(results);
          }
        }, this);

        var config = {
          resourceId: id,
          data: data,
          success: success,
          error: failure
        };

        this._abortRequest();
        this._currentRequest = ds.request(config);
      },

      /**
       * The configuration for client side caching of results.
       */
      _cacheConfig: { type: 'persist', duration: 1, unit: 'days' },

      /**
       * Defines all API requests used by AnalysisService.
       */
      _defineRequests: function() {
        var datasets = [
          'terrai-alerts',
          'umd-loss-gain',
          'biomass-loss',
          'viirs-active-fires',
          'forma-alerts',
          'glad-alerts',
          'guira-loss',
          'imazon-loss',
          'prodes-loss'
        ];

        // Defines requests for each dataset (e.g., forma-alerts) and type (e.g.
        // national)
        _.each(
          datasets,
          function(dataset) {
            _.each(
              this._urls(dataset),
              function(url, id) {
                var cache = this._cacheConfig;
                var config = {
                  cache: cache,
                  url: url,
                  type: 'GET',
                  dataType: 'json'
                };
                ds.define(id, config);
              },
              this
            );
          },
          this
        );
      },

      /**
       * Subscribes to the 'AnalysisService/get' topic.
       */
      _subscribe: function() {
        mps.subscribe(
          'AnalysisService/get',
          _.bind(function(config) {
            this.execute(config);
            this.config = config;
          }, this)
        );

        mps.subscribe(
          'AnalysisService/cancel',
          _.bind(function() {
            this._abortRequest();
          }, this)
        );

        mps.subscribe(
          'AnalysisService/refresh',
          _.bind(function() {
            this.execute(this.config);
          }, this)
        );
      },

      /**
       * Returns analysis API urls for supplied dataset.
       *
       * @param  {string} dataset The dataset
       * @return {object} Object with ids mapping to urls
       */
      _urls: function(dataset) {
        var types = ['world', 'national', 'subnational', 'use', 'wdpa'];
        var params =
          {
            'umd-loss-gain': '{thresh}',
            'loss-by-type': '?aggregate_by={aggregate_by}'
          }[dataset] || '';
        var ids = _.map(types, function(type) {
          return _.str.sprintf('%s:%s', dataset, type);
        });

        var urls = [
          _.str.sprintf('%s/%s%s', URL, dataset, params),
          _.str.sprintf('%s/%s/admin/{iso}%s', URL, dataset, params),
          _.str.sprintf('%s/%s/admin/{iso}/{id1}%s', URL, dataset, params),
          _.str.sprintf('%s/%s/use/{use}/{useid}%s', URL, dataset, params),
          _.str.sprintf('%s/%s/wdpa/{wdpaid}%s', URL, dataset, params)
        ];

        return _.object(ids, urls);
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
        } else if (_.has(config, 'geostore')) {
          return _.str.sprintf('%s:world', dataset);
        }

        return null;
      },

      /**
       * Abort the current request if it exists.
       */
      _abortRequest: function() {
        this._currentRequest && this._currentRequest.abort();
        this._currentRequest = null;
      }
    });

    var service = new AnalysisService();

    return service;
  }
);
