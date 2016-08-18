define([
  'backbone',
  'handlebars',
  'moment',
  'connect/views/ListItemDeleteConfirmView',
  'text!connect/templates/storiesListItem.handlebars'
], function(
  Backbone,
  Handlebars,
  moment,
  ListItemDeleteConfirmView,
  tpl
) {

  'use strict';

  var StoriesListItemView = Backbone.View.extend({
    events: {
      'click .story-delete-item': 'confirmDestroy',
    },

    tagName: 'tr',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.story = options.story;

      this.render();
    },

    render: function() {
      var story = this.story.toJSON();

      if (story.createdAt !== undefined) {
        story.createdAt = moment(story.createdAt).
          format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template(story));

      return this;
    },

    confirmDestroy: function(event) {
      event.preventDefault();

      var confirmView = new ListItemDeleteConfirmView({
        model: this.story});
      this.$el.append(confirmView.render().el);
      this.listenTo(confirmView, 'confirmed', this.destroy.bind(this));
    },

    destroy: function() {
      this.story.destroy({success: this.remove.bind(this)});
    },


  });

  return StoriesListItemView;

});
