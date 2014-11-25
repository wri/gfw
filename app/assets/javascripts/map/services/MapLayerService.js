/**
 * Aysynchronous service for accessing map layer metadata.
 *
 */
define([
  'Class',
  'mps',
  'store',
  'map/services/DataService',
  'uri',
  'underscore'
], function (Class, mps, store, ds, UriTemplate, _) {

  'use strict';

  var MapLayerService = Class.extend({

    requestId: 'MapLayerService:getLayers',

    /**
     * Constructs a new instance of MapLayerService.
     *
     * @return {MapLayerService} instance
     */
    init: function() {
      // this.layers = null;
      this._defineRequests();
    },

    /**
     * The configuration for client side caching of results.
     */
    _cacheConfig: {type: 'persist', duration: 1, unit: 'days'},

    /**
     * Defines CartoDB requests used by MapLayerService.
     */
    _defineRequests: function() {
      var cache = this._cacheConfig;
      var url = this._getUrl();
      var config = {
        cache: cache,
        url: url,
        type: 'POST',
        dataType: 'jsonp'
      };
      ds.define(this.requestId, config);
    },

    /**
     * Asynchronously get layers for supplied array of where specs.
     *
     * @param  {array} where Where objects (e.g., [{id: 123}, {slug: 'loss'}])
     * @param  {function} successCb Function that takes the layers if found.
     * @param  {function} errorCb Function that takes an error if on occurred.
     */
    getLayers: function(where, successCb, errorCb) {
      this._fetchLayers(
        _.bind(function(layers) {
          var hits = _.map(where, _.partial(_.where, layers.rows));
          successCb(_.flatten(hits));
        }, this),
        _.bind(function(error) {
          errorCb(error);
        }, this));
    },

    _getUrl: function() {
      var template = null;
      var sql = null;

      if (!this.url) {
        template = 'http://wri-01.cartodb.com/api/v2/sql{?q}';
        /*jshint multistr: true */
        sql = 'SELECT \
                cartodb_id AS id, \
                slug, \
                title, \
                title_color, \
                subtitle, \
                sublayer, \
                table_name, \
                source, \
                category_color, \
                category_slug, \
                category_name, \
                external, \
                zmin, \
                zmax, \
                mindate, \
                maxdate, \
                ST_XMAX(the_geom) AS xmax, \
                ST_XMIN(the_geom) AS xmin, \
                ST_YMAX(the_geom) AS ymax, \
                ST_YMIN(the_geom) AS ymin, \
                tileurl, \
                true AS visible \
              FROM \
                layerspec_adrian_dev \
              WHERE \
                display = \'true\' \
              ORDER BY \
                displaylayer, \
                title ASC';
        this.url = new UriTemplate(template).fillFromObject({q: sql});
      }

      return this.url;
    },

    _fetchLayers: function(successCb, errorCb) {
      var config = {
        resourceId: this.requestId,
        success: successCb,
        error: errorCb
      };

      ds.request(config);
    },

    // _getLayers: function(slug, category_slug, successCb, errorCb) {
    //   this._fetchLayers(
    //     _.bind(function(layers) {
    //       var hits = _.filter(layers, function(x) {
    //         return (x.category_slug === category_slug && x.slug === slug);
    //       });
    //       successCb(hits ? hits[0] : null);
    //     }, this),
    //     _.bind(function(error) {
    //       errorCb(error);
    //     }, this));
    // }
  });

  var service = new MapLayerService();

  return service;
});
