define([
  'backbone', 'handlebars', 'simplePagination',
  'stories/collections/StoriesCollection',
  'stories/views/StoriesItemView', 'stories/views/StoriesPaginationView',
  'text!stories/templates/stories.handlebars'
], function(
  Backbone, Handlebars, simplePagination,
  Stories,
  StoryView, StoriesPaginationView,
  tpl
) {

  var StoriesIndexView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.stories = new Stories([], {perPage: 5});
      this.stories.setPage(this.$el.data('page') || 1);
      this.listenTo(this.stories, 'sync', this.renderStories);
      this.stories.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.renderPaginationControls();

      return this;
    },

    renderStories: function() {
      var $storiesList = this.$('#storiesKeepList');
      $storiesList.empty();

      this.stories.getPaginatedModels().forEach(function(story) {
        var view = new StoryView({story: story});
        $storiesList.append(view.render().el);
      }.bind(this));
    },

    renderPaginationControls: function() {
      var paginationView = new StoriesPaginationView({
        el: '#pagination-container',
        stories: this.stories
      });
      this.listenTo(paginationView, 'change', this.renderStories);
    }

  });

  return StoriesIndexView;

});
