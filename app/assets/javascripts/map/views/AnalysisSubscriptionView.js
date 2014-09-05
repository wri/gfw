/**
 * The Subscription module.
 *
 * @return Subscription class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'map/presenters/AnalysisSubscriptionPresenter',
  'handlebars',
  'text!map/templates/analysisSubscription.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var Subscription = Backbone.View.extend({
    el: '#analysis-subscribe',
    template: Handlebars.compile(tpl),

    events: function() {
      return {'click .close': '_close'}
    },


    initialize: function() {
      this.presenter = new Presenter(this);
    },

    render: function() {
      this.$el.empty().append(this.template());
      $('.backdrop').fadeIn(function(){$('.analysis_subscribe').show()})
    },

    subscribeAlerts: function() {
      this.render();
    },

    _close: function() {
      var self = this;
      $('.backdrop').fadeOut(function(){self.$el.empty()})
    }

  });

  return Subscription;
});
