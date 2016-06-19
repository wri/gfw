define([
  'backbone', 'handlebars',
  'stories/views/LatestStoriesView',
  'text!stories/templates/index.handlebars'
], function(
  Backbone, Handlebars,
  LatestStoriesView,
  tpl
) {

  'use strict';

  var StoriesIndexView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      var latestStoriesView = new LatestStoriesView();
      this.$('#latestStories').html(latestStoriesView.render().el);

      document.title = 'Crowdsourced Stories | Global Forest Watch';

      return this;
    }

  });

  return StoriesIndexView;

});
