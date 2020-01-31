define([
  'jquery', 'backbone', 'handlebars',
  'stories/collections/StoriesCollection',
  'stories/utilities/story',
  'text!stories/templates/latest_stories.handlebars'
], function(
  $, Backbone, Handlebars,
  Stories,
  StoryUtilities,
  tpl
) {

  'use strict';

  var LatestStoriesView = Backbone.View.extend({

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

  return LatestStoriesView;

});
