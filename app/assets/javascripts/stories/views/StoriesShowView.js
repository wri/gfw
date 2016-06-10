define([
  'mps', 'backbone', 'handlebars',
  'stories/models/StoryModel',
  'views/InterestingView',
  'text!stories/templates/story.handlebars'
], function(
  mps, Backbone, Handlebars,
  Story,
  InterestingView,
  tpl
) {

  var StoriesShowView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      var storyId = options.id;
      this.story = new Story({id: storyId});
      this.listenTo(this.story, 'change', this.render);
      this.story.fetch();
    },

    render: function() {
      this.$el.html(this.template({
        story: this.story.toJSON(),
        formattedDate: this.story.formattedDate()
      }));

      new InterestingView();
      mps.publish('Interesting/update',['discussion_forum, how_to, submit_a_story']);

      return this;
    }

  });

  return StoriesShowView;

});
