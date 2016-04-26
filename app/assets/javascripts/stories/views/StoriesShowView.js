define([
  'backbone', 'handlebars',
  'stories/models/StoryModel',
  'text!stories/templates/story.handlebars'
], function(
  Backbone, Handlebars,
  Story,
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

      return this;
    }

  });

  return StoriesShowView;

});
