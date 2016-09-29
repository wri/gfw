define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'models/UserModel',
  'stories/views/StoriesIndexView',
  'stories/views/StoriesListView',
  'stories/views/StoriesNewView',
  'stories/views/StoriesShowView',
  'connect/views/LoginView'
], function(
  $, Backbone,
  NotificationsView,
  User,
  StoriesIndexView,
  StoriesListView,
  StoriesNewView,
  StoriesShowView,
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
      var storyIndex = new StoriesIndexView({
        el: '.layout-content',
      });
    },

    listStories: function() {
      var storiesList = new StoriesListView({
        el: '.layout-content',
      });
    },

    checkLoggedIn: function() {
      this.user = new User();
      return this.user.fetch();
    },

    newStory: function() {
      this.checkLoggedIn()
        .then(function() {
          new StoriesNewView();
        }.bind(this))

        .fail(function() {
          var loginView = new LoginView({
            message: 'Please log in to submit a story.' });
          this.el.html(loginView.render().el);
        }.bind(this));
    },

    showStory: function(storyId) {
      var storyView = new StoriesShowView({
        el: '.layout-content',
        id: storyId
      });
    },

    show404: function() {
      window.location = '/404';
    }

  });

  return StoriesRouter;

});
