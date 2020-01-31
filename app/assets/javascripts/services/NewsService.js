define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var CONFIG = {
    newsDataset: '916022a9-2802-4cc6-a0f2-a77f81dd0c09',
    newsTable: 'gfw_home_news'
  };

  var GET_REQUEST_NEWS_ID = 'NewsService:getNews';

  var APIURL = window.gfw.config.GFW_API;

  var APIURLS = {
    'getNews'   : '/query/{newsDataset}?sql=SELECT name, description, link FROM {newsTable}',
  };

  var NewsService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getNews: function() {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getNews).fillFromObject(CONFIG);

        this.defineRequest(GET_REQUEST_NEWS_ID,
          url, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: GET_REQUEST_NEWS_ID,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.abortRequest(GET_REQUEST_NEWS_ID);
        this.currentRequest[GET_REQUEST_NEWS_ID] = ds.request(requestConfig);
      }.bind(this));
    },

    defineRequest: function (id, url, cache) {
      ds.define(id, {
        cache: cache,
        url: APIURL + url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        decoder: function ( data, status, xhr, success, error ) {
          if ( status === "success" ) {
            success( data, xhr );
          } else if ( status === "fail" || status === "error" ) {
            error( JSON.parse(xhr.responseText) );
          } else if ( status === "abort") {

          } else {
            error( JSON.parse(xhr.responseText) );
          }
        }
      });
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function(request) {
      if (this.currentRequest && this.currentRequest[request]) {
        this.currentRequest[request].abort();
        this.currentRequest[request] = null;
      }
    }

  });

  return new NewsService();

});
