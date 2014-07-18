/**
 * Aysynchronous service for use stories layer.
 *
 */
define([
  'Class',
  'services/DataService'
], function (Class, ds) {

  'use strict';

  var StoryService = Class.extend({

    requestId: 'StoryService',

    url: '/stories.json?for_map=true',

    /**
     * Constructs a new instance of StoryService.
     *
     * @return {StoryService} instance
     */
    init: function() {
      this.layers = null;
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
      var config = {resourceId: this.requestId, success: successCb,
        error: errorCb};

      ds.request(config);
    }

  });

  var service = new StoryService();

  return service;
});
