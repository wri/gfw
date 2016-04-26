define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'stories/views/StoriesShowView'
], function(
  $, Backbone,
  NotificationsView,
  StoriesShowView
) {

  'use strict';

  var StoriesRouter = Backbone.Router.extend({

    el: $('.layout-content'),

    routes: {
      'stories/new': 'newStory',
      'stories/:id': 'showStory',
      '*path': 'show404'
    },

    initialize: function() {
      new NotificationsView();
    },

    newStory: function() {
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
