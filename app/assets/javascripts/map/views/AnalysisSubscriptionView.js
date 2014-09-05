/**
 * The Subscription module.
 *
 * @return Subscription class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenters/AnalysisSubscriptionPresenter',
  'handlebars',
  'text!templates/analysisSubscription.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var Subscription = Backbone.View.extend({

    className: 'widget widget-subscription',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.presenter = new Presenter(this);
    },

    subscribeAlerts: function() {
      console.log('view subscribe alerts');
    }

  });

  return Subscription;
});
