define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'map/models/UserModel',
  'stories/views/StoriesIndexView', 'stories/views/StoriesListView', 'stories/views/StoriesNewView', 'stories/views/StoriesShowView',
  'connect/views/LoginView'
], function(
  $, Backbone,
  NotificationsView,
  User,
  StoriesIndexView, StoriesListView, StoriesNewView, StoriesShowView,
  LoginView
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

    checkLoggedIn: function() {
      this.user = new User();
      return this.user.fetch();
    },

    newStory: function() {
      this.checkLoggedIn().then(function() {
        new StoriesNewView();
      }.bind(this)).fail(function() {
        var loginView = new LoginView({
          message: 'Please log in to submit a story.' });
        this.el.html(loginView.render().el);
      }.bind(this));
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
