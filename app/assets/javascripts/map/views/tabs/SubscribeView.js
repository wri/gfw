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
    guyra: 'alerts/guyra',
    umd_as_it_happens: 'alerts/glad',
    umd_as_it_happens_per: 'alerts/glad',
    umd_as_it_happens_cog: 'alerts/glad',
    umd_as_it_happens_idn: 'alerts/glad',
    viirs_fires_alerts: 'alerts/viirs'
  };

  var SubscribeView = Backbone.View.extend({

    id: 'subscription-modal',
    className: 'subscription-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .subscription-modal-close': 'close',
      'click .subscription-modal-backdrop': 'close',
      'click .subscription-sign-in': 'trackSignIn',
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
        date: moment().format('MMM D, YYYY'),
        dataset: this.subscription && this.subscription.formattedTopic().long_title
      }));
      this.setupAuthLinks();

      return this;
    },

    refreshEmail: function() {
      if (_.isEmpty(this.user.get('email'))) {
        this.showSpinner();
        this.user.fetch();
      }
    },

    show: function(options){
      this.refreshEmail();

      if (!this.user.isLoggedIn()) {
        this.presenter.setSubscribeState();
      }

      this.$el.addClass('is-active');
      this.presenter.updateUrl();

      this.createSubscription(options);
      this.currentStep = 0;

      this.render();
    },

    close: function(event) {
      if (event !== undefined && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.$el.removeClass('is-active');
      this.render();
      this.presenter.unSetSubscribeState();
      this.presenter.updateUrl();

      if (this.subscription.isNew()) {
        this.presenter.subscribeCancel();
      } else {
        this.presenter.subscribeEnd();
      }
    },

    isOpen: function() {
      return this.$el.hasClass('is-active');
    },

    showSpinner: function() {
      this.$('.subscription-spinner-container').css('visibility', 'visible');
    },

    hideSpinner: function() {
      this.$('.subscription-spinner-container').css('visibility', 'hidden');
    },

    setupAuthLinks: function() {
      var apiHost = window.gfw.config.GFW_API_HOST;

      this.$('.subscription-sign-in').each(function() {
        var $link = $(this);
        $link.attr('href', apiHost + $link.attr('href'));
      });
    },

    trackSignIn: function() {
      window.ga('send', 'event', 'User Profile', 'Signin', 'menu');
    },

    createSubscription: function(options) {
      var analysisResource = options.analysisResource,
          geostoreId = options.geostore;

      this.subscription = new Subscription({
        topic: TOPICS[options.layer.slug] || options.layer.title,
        url: window.location.href
      });
      this.subscription.set(analysisResource);

      if (analysisResource) {
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
      }

      if (geostoreId) {
        this.subscription.set('geostore_id', geostoreId);
      }
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
      this.showSpinner();

      window.ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' +
        this.subscription.get('topic') + ', Email: ' + this.subscription.get('email'));

      this.subscription.set('name',
        this.$el.find('#subscriptionName').val());

      this.stopListening(this.user);
      this.user.setEmailIfEmpty(this.subscription.get('email'));
      this.user.save();

      this.subscription.save().
        then(this.onSave.bind(this)).
        fail(this.close.bind(this));
    },

    onSave: function() {
      this.hideSpinner();
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
