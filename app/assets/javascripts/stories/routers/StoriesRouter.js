define([
  'jquery', 'backbone',
  'views/NotificationsView',
  'models/UserModel',
  'stories/views/StoriesIndexView',
  'stories/views/StoriesListView',
  'stories/views/StoriesNewView',
  'stories/views/StoriesShowView',
], function(
  $, Backbone,
  NotificationsView,
  User,
  StoriesIndexView,
  StoriesListView,
  StoriesNewView,
  StoriesShowView
) {

  'use strict';

  var StoriesRouter = Backbone.Router.extend({

    status: new (Backbone.Model.extend({
      params: null
    })),

    el: $('.layout-content'),

    routes: {
      'stories': 'index',
      'stories/crowdsourcedstories': 'listStories',
      'stories/new': 'newStory',
      'stories/edit/:id': 'editStory',
      'stories/:id': 'showStory',
      '*path': 'show404'
    },

    initialize: function() {
      new NotificationsView();
    },

    navigateTo(route, params) {
      window.scrollTo(0, 0);
      this.setParams(params);
      this.navigate(route, {
        trigger: true
      });
    },

    setParams: function(params) {
      this.status.set({
        params: params
      });
    },

    clearParams: function() {
      this.status.set({
        params: null
      });
    },

    index: function() {
      new StoriesIndexView({
        el: '.layout-content'
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
          new StoriesNewView({
            router: this,
            alreadyLoggedIn: true
          });
        }.bind(this))

        .fail(function() {
          new StoriesNewView({
            router: this,
            alreadyLoggedIn: false
          });
        }.bind(this));
    },

    showStory: function(storyId) {
      if (this.storyView) {
        this.storyView.remove();
      }
      this.storyView = new StoriesShowView({
        el: '.layout-content',
        id: storyId,
        opts: _.clone(this.status.attributes.params)
      });
      this.clearParams();
    },

    editStory: function(storyId) {
      var editStoryView = new StoriesNewView({
        id: storyId
      });
    },

    show404: function() {
      window.location = '/404';
    }

  });

  return StoriesRouter;

});
