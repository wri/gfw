define([
  'backbone',
  'handlebars',
  'moment',
  'mps',
  'connect/views/ListItemDeleteConfirmView',
  'text!connect/templates/storiesListItem.handlebars'
], function(
  Backbone,
  Handlebars,
  moment,
  mps,
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
      this.user = options.user;

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

      this.user.checkLogged()
        .then(function(response) {
          this.story.set('from', 'Global Forest Watch');

          var confirmView = new ListItemDeleteConfirmView({
            model: this.story
          });
          this.$el.append(confirmView.render().el);
          this.listenTo(confirmView, 'confirmed', this.destroy.bind(this));
        }.bind(this))
        .catch(function(e) {
          mps.publish('Notification/open', ['notification-my-gfw-not-logged']);
        }.bind(this));
    },

    destroy: function() {
      this.story.destroy({success: this.remove.bind(this)});
    },


  });

  return StoriesListItemView;

});
