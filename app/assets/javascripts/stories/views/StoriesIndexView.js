define([
  'jquery', 'backbone', 'handlebars', 'simplePagination',
  'stories/collections/StoriesCollection',
  'stories/utilities/story',
  'stories/views/StoriesItemView', 'stories/views/StoriesPaginationView',
  'text!stories/templates/index.handlebars'
], function(
  $, Backbone, Handlebars, simplePagination,
  Stories,
  StoryUtilities,
  StoryView, StoriesPaginationView,
  tpl
) {

  'use strict';

  var StoriesIndexView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'click #storiesLatestNavigationView li' : 'onStoryClick'
    },

    initialize: function() {
      this.stories = new Stories([], {perPage: 5});
      this.listenTo(this.stories, 'sync', this.render);
      this.stories.fetch();

      this.render();
    },

    render: function() {
      var stories = this.stories.toJSON().slice(0,4);
      stories = stories.map(function(story) {
        return StoryUtilities.decorateWithIconUrl(story);
      });

      this.$el.html(this.template({stories: stories}));
      //this.$('#storiesSpinner').addClass('-start');

      document.title = 'Crowdsourced Stories | Global Forest Watch';

      return this;
    },

    onStoryClick: function(event) {
      var $storiesList = this.$('#storiesLatestListView'),
          $storiesNavigation = this.$('#storiesLatestNavigationView');

      var active = $storiesNavigation.
        children('li').index($(event.currentTarget));

      $storiesNavigation.children('li').toggleClass('-active', false);
      $storiesNavigation.children('li').eq(active).toggleClass('-active', true);

      $storiesList.children('li').toggleClass('-active', false);
      $storiesList.children('li').eq(active).toggleClass('-active', true);
    }

  });

  return StoriesIndexView;

});
