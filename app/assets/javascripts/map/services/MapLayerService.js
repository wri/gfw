/**
 * Aysynchronous service for accessing map layer metadata.
 *
 */
define([
  'Class',
  'mps',
  'store',
  'nsa',
  'uri',
  'underscore'
], function (Class, mps, store, nsa, UriTemplate, _) {

  'use strict';

  var MapLayerService = Class.extend({

    init: function() {
      this.layers = null;
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
          var hits = _.map(where, _.partial(_.where, layers));
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
                ST_XMAX(the_geom) AS xmax, \
                ST_XMIN(the_geom) AS xmin, \
                ST_YMAX(the_geom) AS ymax, \
                ST_YMIN(the_geom) AS ymin, \
                tileurl, \
                true AS visible \
              FROM \
                layerinfo_dev_copy \
              WHERE \
                display = TRUE \
              ORDER BY \
                displaylayer, \
                title ASC';
        this.url = new UriTemplate(template).fillFromObject({q: sql});
      }

      return this.url;
    },

    _fetchLayers: function(successCb, errorCb) {
      nsa.spy(
        this._getUrl(),
        {},
        _.bind(function(layers) {
          successCb(layers.rows);
        }, this),
        _.bind(function(jqxhr, status, error) {
          console.error(status, error);
          errorCb('MapLayerService unable to fetch layers from CartoDB');
        }, this));
    },

    _getLayers: function(slug, category_slug, successCb, errorCb) {
      this._fetchLayers(
        _.bind(function(layers) {
          var hits = _.filter(layers, function(x) {
            return (x.category_slug === category_slug && x.slug === slug);
          });
          successCb(hits ? hits[0] : null);
        }, this),
        _.bind(function(error) {
          errorCb(error);
        }, this));
    }
  });

  var service = new MapLayerService();

  return service;
});
