define([
  'backbone',
  'handlebars',
  'simplePagination',
  'stories/collections/StoriesCollection',
  'stories/views/StoriesItemView',
  'stories/views/StoriesPaginationView',
  'text!stories/templates/stories.handlebars'
], function(
  Backbone,
  Handlebars,
  simplePagination,
  Stories,
  StoryView,
  StoriesPaginationView,
  tpl
) {

  'use strict';

  var StoriesListView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.stories = new Stories([], {perPage: 5});
      this.stories.setPage(this.$el.data('page') || 1);
      this.listenTo(this.stories, 'sync', this.renderStories);
      this.listenTo(this.stories, 'sync', this.renderPaginationControls);
      this.stories.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.$('#storiesSpinner').addClass('-start');
      this.renderPaginationControls();

      $('#crowdsourcedStories').addClass('current');
      document.title = 'Crowdsourced Stories | Global Forest Watch';

      return this;
    },

    renderStories: function() {
      var $storiesList = this.$('#storiesList');
      $storiesList.empty();

      this.stories.getPaginatedModels().forEach(function(story) {
        var view = new StoryView({story: story});
        $storiesList.append(view.render().el);
      }.bind(this));

      this.$('#storiesSpinner').removeClass('-start');
    },

    renderPaginationControls: function() {
      var paginationView = new StoriesPaginationView({
        el: '#pagination-container',
        stories: this.stories
      });
      this.listenTo(paginationView, 'change', this.renderStories);
    }

  });

  return StoriesListView;

});
