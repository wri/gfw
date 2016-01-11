define([
  'backbone',
  'underscore',
  'handlebars',
  'map/models/UserModel',
  'map/presenters/tabs/SubscribePresenter',
  'connect/models/Subscription',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, User, Presenter, Subscription, tpl) {

  'use strict';

  var SubscribeView = Backbone.View.extend({

    id: 'subscription-modal',
    className: 'modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .modal-close' : 'hide',
      'click .modal-backdrop' : 'hide',
      'click #showName': 'askForName',
      'click #subscribe': 'subscribe',
    },

    initialize: function(){
      this.presenter = new Presenter(this);

      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.fetch();

      this.render();
    },

    render: function(){
      this.$el.html(this.template({
        email: this.user.get('email'),
        loggedIn: this.user.isLoggedIn()
      }));

      return this;
    },

    show: function(options){
      this.createSubscription(options.analysisResource);
      this.currentStep = 0;

      this.$el.addClass('is-active');
    },

    hide: function(event) {
      if (event !== undefined && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.$el.removeClass('is-active');
      this.render();
      this.presenter.hide();
    },

    createSubscription: function(analysisResource) {
      this.subscription = new Subscription({
        topic: 'Subscribe to alerts',
        name: this.$el.find('#subscriptionName').val()
      });

      var geom;
      if (analysisResource.type === 'geojson') {
        geom = JSON.parse(analysisResource.geojson);
      } else {
        if (analysisResource.geom) {
          geom = analysisResource.geom.geometry;
        } else {
          geom = this.presenter.geom_for_subscription;
        }
      }

      this.subscription.set('geom', geom);
    },

    askForName: function() {
      this.subscription.set('email',
        this.$el.find('#subscriptionEmail').val());

      if (this.subscription.hasValidEmail()) {
        this.nextStep();
      } else {
        this.presenter.notificate('email-incorrect');
      }
    },

    subscribe: function() {
      window.ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' +
        this.subscription.get('topic') + ', Email: ' + this.subscription.get('email'));

      this.subscription.set('email',
        this.$el.find('#subscriptionName').val());

      this.subscription.save().
        then(this.onSave.bind(this)).
        fail(this.hide.bind(this));
    },

    onSave: function() {
      this.presenter.subscribeEnd();
      this.nextStep();
    },

    nextStep: function(index) {
      if (this.currentStep === undefined) {
        this.currentStep = 0;
      }

      if (index !== undefined && _.isNumber(index)) {
        this.currentStep = index;
      } else {
        this.currentStep += 1;
      }

      var $steps = this.$('.steps');
      $steps.removeClass('current');
      $steps.eq(this.currentStep).addClass('current');
    }

  });

  return SubscribeView;
});
