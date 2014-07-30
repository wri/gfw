/**
 * Aysynchronous service for use stories layer.
 *
 */
define([
  'underscore',
  'Class',
  'services/DataService'
], function (_, Class, ds) {

  'use strict';

  var InfoamazoniaStoryService = Class.extend({

    requestId: 'UserStoryService',

    url: '//wri-01.cartodb.com/api/v2/sql?q=SELECT *, ST_AsGeoJSON(the_geom) AS latlng FROM infoamazonia',

    /**
     * Constructs a new instance of StoryService.
     *
     * @return {StoryService} instance
     */
    init: function() {
      this._defineRequests();
    },

    /**
     * Defines JSON requests used by StoryService.
     */
    _defineRequests: function() {
      var cache = {type: 'persist', duration: 1, unit: 'days'};
      var url = this.url;
      var config = {cache: cache, url: url, type: 'GET', dataType: 'json'};
      ds.define(this.requestId, config);
    },

    fetchStories: function(successCb, errorCb) {
      function _parseData(data) {
        var result = _.map(data.rows, function(d) {
          d.marker = JSON.parse(d.marker);
          d.latlng = JSON.parse(d.latlng).coordinates;
          return d;
        });
        successCb(result);
      }

      var config = {resourceId: this.requestId, success: _parseData,
        error: errorCb};

      ds.request(config);
    }

  });

  var service = new InfoamazoniaStoryService();

  return service;
});
