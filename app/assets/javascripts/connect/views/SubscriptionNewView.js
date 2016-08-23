define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'text!connect/templates/subscriptionNew.handlebars'
], function($, Backbone, Handlebars, _, mps, tpl) {

  'use strict';

  var SubscriptionNewView = Backbone.View.extend({
    
    template: Handlebars.compile(tpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));      
    },

    show: function() {
      console.log('show');
    },

  });

  return SubscriptionNewView;

});
