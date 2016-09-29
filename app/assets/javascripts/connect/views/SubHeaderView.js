define([
  'backbone',
  'handlebars',
], function(Backbone, Handlebars) {

  'use strict';

  var LoginView = Backbone.View.extend({

    events: {
      'click a': 'navigateTo',
    },

    initialize: function(options) {
      this.router = options.router;
    },

    /**
     * UI EVENTS
     * - navigateTo
     */
    navigateTo: function(e) {
      e & e.preventDefault();
      var href = $(e.currentTarget).data('href');
      this.router.navigateTo(href, { trigger: true });
    },

    /**
     * SERTERS
     * - setPage
     */
    setPage: function(page) {
      this.$el.find('a').removeClass('current');
      this.$el.find('a[data-page="'+page+'"]').addClass('current');
    }

  });

  return LoginView;

});
