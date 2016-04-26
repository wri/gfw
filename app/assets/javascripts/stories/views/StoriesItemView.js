define([
  'backbone', 'handlebars', 'underscore',
  'text!stories/templates/story_item.handlebars'
], function(
  Backbone, Handlebars, _,
  tpl
) {

  var StoriesItemView = Backbone.View.extend({

    tagName: 'li',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.story = options.story;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        story: this.story.toJSON(),
        icon_url: this.icon_url()
      }));

      return this;
    },

    icon_url: function() {
      var media = this.story.get('media'), img;
      if (media.length > 0 && !_.isEmpty(media[media.length-1].previewUrl)) {
        var url = media[media.length-1].previewUrl;
        img = 'http://gfw2stories.s3.amazonaws.com/uploads/' + url;
      } else {
        img = 'https://maps.googleapis.com/maps/api/staticmap?center=' + this.story.get('lat') + ',' + this.story.get('lng') + '&zoom=2&size=80x80';
      }

      return img;
    }

  });

  return StoriesItemView;

});
