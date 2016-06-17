define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'stories/views/StoriesIndexView', 'stories/views/StoriesListView', 'stories/views/StoriesNewView', 'stories/views/StoriesShowView'
], function(
  $, Backbone,
  NotificationsView,
  StoriesIndexView, StoriesListView, StoriesNewView, StoriesShowView
) {

  'use strict';

  var StoriesRouter = Backbone.Router.extend({

    el: $('.layout-content'),

    routes: {
      'stories': 'index',
      'stories/crowdsourcedstories': 'listStories',
      'stories/new': 'newStory',
      'stories/:id': 'showStory',
      '*path': 'show404'
    },

    initialize: function() {
      new NotificationsView();
    },

    index: function() {
      var storyIndex = new StoriesIndexView();
      this.el.html(storyIndex.render().el);
    },

    listStories: function() {
      var storiesList = new StoriesListView();
      this.el.html(storiesList.render().el);
    },

    newStory: function() {
      new StoriesNewView();
    },

    showStory: function(storyId) {
      var storyView = new StoriesShowView({id: storyId});
      this.el.html(storyView.render().el);
    },

    show404: function() {
      window.location = '/404';
    }

  });

  return StoriesRouter;

});
