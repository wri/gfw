/**
 * Aysynchronous service for use stories layer.
 *
 */
define([
  'Class',
  'map/services/DataService'
], function (Class, ds) {

  'use strict';

  var UserStoryService = Class.extend({

    requestId: 'UserStoryService',

    url: window.gfw.config.GFW_API + '/story?fields=title,lat,lng',

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
      var cache = false;
      var url = this.url;
      var config = {cache: cache, url: url, type: 'GET', dataType: 'json'};
      ds.define(this.requestId, config);
    },

    fetchStories: function(successCb, errorCb) {
      function _parseData(data) {
        successCb(data.data);
      }

      var config = {resourceId: this.requestId, success: _parseData,
        error: errorCb};

      ds.request(config);
    }

  });

  var service = new UserStoryService();

  return service;
});
