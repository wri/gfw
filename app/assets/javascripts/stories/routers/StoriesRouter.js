define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'stories/views/StoriesIndexView', 'stories/views/StoriesNewView', 'stories/views/StoriesShowView'
], function(
  $, Backbone,
  NotificationsView,
  StoriesIndexView, StoriesNewView, StoriesShowView
) {

  'use strict';

  var StoriesRouter = Backbone.Router.extend({

    el: $('.layout-content'),

    routes: {
      'stories': 'index',
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
