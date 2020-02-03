define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_ID = 'ShapeService:get';

  var SQL = {
    'protected_areas' : 'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from wdpa_protected_areas where wdpaid ={id}',
    'logging': 'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_logging where cartodb_id ={id}',
    'mining':'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_mining where cartodb_id ={id}',
    'oilpalm': 'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_oil_palm where cartodb_id ={id}',
    'fiber': 'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from gfw_wood_fiber where cartodb_id ={id}',
    'default': 'https://wri-01.carto.com/api/v2/sql/?q=SELECT ST_AsGeoJSON(the_geom) from {slug} where cartodb_id ={id}'
  };


  var ShapeService = Class.extend({

    get: function(slug,id) {
      return new Promise(function(resolve, reject) {
        ds.define(GET_REQUEST_ID, {
          cache: {type: 'persist', duration: 1, unit: 'days'},
          url: this.getUrl(slug,id),
          type: 'GET',
          dataType: 'json',
          decoder: function ( data, status, xhr, success, error ) {
            if ( status === "success" ) {
              success( data, xhr );
            } else if ( status === "fail" || status === "error" ) {
              error( xhr );
            } else if ( status === "abort") {

            } else {
              error( xhr );
            }
          }
        });

        var requestConfig = {
          resourceId: GET_REQUEST_ID,
          success: function(data, status) {
            var geojson = data && data.rows[0] && data.rows[0].st_asgeojson
              ? JSON.parse(data.rows[0].st_asgeojson)
              : {};
            resolve(geojson,status);
          },
          error: function(error) {
            reject(error);
          }
        };

        this.abortRequest();
        this.currentRequest = ds.request(requestConfig);

      }.bind(this));
    },

    getUrl: function(slug,id) {
      var sql = (!!SQL[slug]) ? SQL[slug] : SQL['default'];
      return new UriTemplate(sql).fillFromObject({
        id: id,
        slug: slug
      });
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function() {
      if (this.currentRequest) {
        this.currentRequest.abort();
        this.currentRequest = null;
      }
    }

  });

  return new ShapeService();

});
