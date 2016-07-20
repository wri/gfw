define([
  'backbone', 'underscore', 'handlebars', 'moment',
  'map/presenters/tabs/SubscribePresenter',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, moment, Presenter, tpl) {

  'use strict';

  var SubscribeView = Backbone.View.extend({

    id: 'subscription-modal',
    className: 'subscription-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .subscription-modal-close': 'onCloseClick',
      'click .subscription-modal-backdrop': 'onCloseClick',
      'click .subscription-sign-in': 'onTrackSignInClick',
      'click #returnToMap': 'onCloseClick',
      'click #showName': 'onAskForNameClick',
      'click #subscribe': 'onSubscribeClick',
    },

    initialize: function(){
      this.presenter = new Presenter(this);

      this.render();
    },

    render: function(){
      this.$el.html(this.template({
        email: this.presenter.user.get('email'),
        loggedIn: this.presenter.user.isLoggedIn(),
        date: moment().format('MMM D, YYYY'),
        dataset: this.presenter.subscription &&
                 this.presenter.subscription.formattedTopic().long_title
      }));
      this.setupAuthLinks();
      this.cache();
      return this;
    },

    setupAuthLinks: function() {
      var apiHost = window.gfw.config.GFW_API_HOST;

      this.$('.subscription-sign-in').each(function() {
        var $link = $(this);
        $link.attr('href', apiHost + $link.attr('href'));
      });
    },

    cache: function() {
      this.$spinner = this.$('.subscription-spinner-container');
      this.$subscriptionName = this.$el.find('#subscriptionName');
      this.$subscriptionEmail = this.$('#subscriptionEmail');
      this.$steps = this.$('.steps');
    },

    show: function(){
      this.$el.addClass('is-active');

      this.render();
    },

    setClose: function() {
      this.$el.removeClass('is-active');
      this.render();
    },

    updateCurrentStep: function(step) {
      this.$steps.removeClass('current');
      this.$steps.eq(step).addClass('current');
    },

    isOpen: function() {
      return this.$el.hasClass('is-active');
    },

    showSpinner: function() {
      this.$spinner.css('visibility', 'visible');
    },

    hideSpinner: function() {
      this.$spinner.css('visibility', 'hidden');
    },

    /**
     * Events handlers
     */
    onCloseClick: function(event) {
      if (event !== undefined && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.presenter.close();
    },

    onTrackSignInClick: function() {
      window.ga('send', 'event', 'User Profile', 'Signin', 'menu');
    },

    onAskForNameClick: function() {
      this.presenter.askForName(this.$subscriptionEmail.val());
    },

    onSubscribeClick: function() {
      this.showSpinner();

      // window.ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' +
      //   this.presenter.subscription.get('topic') + ', Email: ' + this.presenter.subscription.get('email'));

      this.presenter.subscribe(this.$subscriptionName.val());
    }

  });

  return SubscribeView;
});
