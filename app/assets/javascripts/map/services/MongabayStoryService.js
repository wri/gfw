/**
 * Aysynchronous service for use stories layer.
 *
 */
define([
  'Class',
  'underscore',
  'map/services/DataService'
], function (Class, _, ds) {

  'use strict';

  var UserStoryService = Class.extend({

    requestId: 'MongabayStoryService',

    url: 'https://wri-01.carto.com/api/v2/sql?q=SELECT * FROM mongabay &format=json',

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
          d.lng = d.lon;
          return d;
        });
        successCb(result);
      }

      ds.request({resourceId: this.requestId, success: _parseData,
        error: errorCb});
    }

  });

  var service = new UserStoryService();

  return service;
});
