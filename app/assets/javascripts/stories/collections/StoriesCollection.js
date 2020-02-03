define([
  'backbone',
  'stories/models/StoryModel'
], function(Backbone, Story) {

  'use strict';

  var Stories = Backbone.Collection.extend({
    model: Story,

    url: window.gfw.config.GFW_API + '/story/',

    initialize: function(models, options) {
      options = options || {};
      this.perPage = options.perPage || 10;
      this.setPage(1);
    },

    parse: function(response) {
      return (response.data.length) ? response.data.reverse() : response.data;
    },

    getPaginatedModels: function() {
      var startIndex = (this.page - 1) * this.perPage,
          endIndex   = this.page * this.perPage;
      return this.models.slice(startIndex, endIndex);
    },

    setPage: function(pageNumber) {
      this.page = pageNumber;
    }
  });

  return Stories;

});
