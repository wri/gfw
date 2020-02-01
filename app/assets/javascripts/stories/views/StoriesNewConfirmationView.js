define([
  'backbone', 'handlebars',
  'text!stories/templates/storiesNewConfirmation.handlebars'
], function(Backbone, Handlebars, tpl) {

  'use strict';

  var StoriesNewConfirmView = Backbone.View.extend({
    events: {
      'click #go-to-story': 'cancel',
      'click #go-to-stories': 'goToStories',
      'click .modal-backdrop': 'cancel',
      'click .modal-close': 'cancel'
    },

    className: 'stories-confirmation-modal',

    template: Handlebars.compile(tpl),

    render: function(params) {
      this.$el.html(this.template(params));
      return this;
    },

    cancel: function(event) {
      event.preventDefault();
      this.remove();
    },

    goToStories: function(event) {
      event.preventDefault();

      this.remove();
      window.location.href = '/my-gfw/stories';
    }

  });

  return StoriesNewConfirmView;

});
