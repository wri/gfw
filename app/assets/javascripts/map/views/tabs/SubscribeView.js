define([
  'backbone', 'underscore', 'handlebars', 'moment',
  'map/models/UserModel',
  'map/presenters/tabs/SubscribePresenter',
  'connect/models/Subscription',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, moment, User, Presenter, Subscription, tpl) {

  'use strict';

  var TOPICS = {
    loss: 'alerts/treeloss',
    forestgain: 'alerts/treegain',
    forma: 'alerts/forma',
    imazon: 'alerts/sad',
    modis: 'alerts/quicc',
    terrailoss: 'alerts/terra',
    prodes: 'alerts/prodes',
    guyra: 'alerts/guyra'
  };

  var SubscribeView = Backbone.View.extend({

    id: 'subscription-modal',
    className: 'subscription-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .subscription-modal-close': 'close',
      'click .subscription-modal-backdrop': 'close',
      'click #returnToMap': 'close',
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
        loggedIn: this.user.isLoggedIn(),
        date: moment().format('MMM D, YYYY')
      }));
      this.setupAuthLinks();

      return this;
    },

    show: function(options){
      if (!this.user.isLoggedIn()) {
        this.presenter.convertToSubscriptionTab();
      }

      this.createSubscription(options);
      this.currentStep = 0;

      this.$el.addClass('is-active');
    },

    close: function(event) {
      if (event !== undefined && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.$el.removeClass('is-active');
      this.render();
      this.presenter.updateUrl();
    },

    setupAuthLinks: function() {
      var apiHost = window.gfw.config.GFW_API_HOST;

      this.$('.subscription-sign-in').each(function() {
        var $link = $(this);
        $link.attr('href', apiHost + $link.attr('href'));
      });
    },

    createSubscription: function(options) {
      var analysisResource = options.analysisResource;

      this.subscription = new Subscription({
        topic: TOPICS[options.layer.slug] || options.layer.title,
        url: this._getUrl()
      });
      this.subscription.set(analysisResource);

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

      this.subscription.set('name',
        this.$el.find('#subscriptionName').val());

      this.subscription.save().
        then(this.onSave.bind(this)).
        fail(this.close.bind(this));
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
    },

    _getUrl: function() {
      return window.location.href.replace('subscription-tab', 'analysis-tab');
    }

  });

  return SubscribeView;
});
