define([
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'map/presenters/tabs/SubscribePresenter',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, moment, Presenter, tpl) {

  'use strict';

  var SubscribeView = Backbone.View.extend({

    el: '#subscription-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click .subscription-modal-close': 'onClickClose',
      'click .subscription-modal-backdrop': 'onClickClose',
      'click .subscription-sign-in': 'onClickTrackSignIn',
      'click #returnToMap': 'onClickClose',
      'click #showName': 'onClickCheckEmail',
      'click #subscribe': 'onClickSubscribe',
    },

    initialize: function(){
      this.presenter = new Presenter(this);
    },

    cache: function() {
      this.$spinner = this.$el.find('.subscription-spinner-container');
      this.$subscriptionName = this.$el.find('#subscriptionName');
      this.$subscriptionLanguage = this.$el.find('#subscriptionLanguage');
      this.$subscriptionEmail = this.$el.find('#subscriptionEmail');
      this.$steps = this.$el.find('.steps');
    },

    render: function(){
      this.$el.html(this.template({
        loggedIn: this.presenter.user.isLoggedIn(),
        email: this.presenter.user.get('email'),
        date: moment().format('MMM D, YYYY'),
        dataset: this.presenter.subscription &&
                 this.presenter.subscription.formattedTopic().long_title
      }));

      this.setupAuthLinks();
      
      this.cache();
      this.renderChosen();
    },

    renderChosen: function() {
      this.$subscriptionLanguage.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        disable_search: true,
        no_results_text: 'Oops, nothing found!'
      });
    },   

    show: function(){
      this.$el.addClass('is-active');
      this.render();
    },

    hide: function() {
      this.$el.removeClass('is-active');
      this.render();
    },

    // Spinners
    showSpinner: function() {
      this.$spinner.css('visibility', 'visible');
    },

    hideSpinner: function() {
      this.$spinner.css('visibility', 'hidden');
    },

    setupAuthLinks: function() {
      var apiHost = window.gfw.config.GFW_API_HOST_NEW_API;

      this.$('.subscription-sign-in').each(function() {
        var $link = $(this);
        $link.attr('href', apiHost + $link.attr('href'));
      });
    },

    updateCurrentStep: function(step) {
      this.$steps.removeClass('current');
      this.$steps.eq(step).addClass('current');
    },


    /**
     * UI EVENTS
     * - onClickClose
     * - onClickTrackSignIn
     * - onClickCheckEmail
     * - onClickSubscribe
     * @param  {[object]} e
     */
    onClickClose: function(e) {
      e && e.preventDefault() && e.stopPropagation()
      this.presenter.status.set('visibility', false);
    },

    onClickTrackSignIn: function(e) {
      window.ga('send', 'event', 'User Profile', 'Signin', 'menu');
    },

    onClickCheckEmail: function(e) {
      this.presenter.checkEmail(this.$subscriptionEmail.val());
    },

    onClickSubscribe: function(e) {
      this.showSpinner();

      this.presenter.saveSubscription({        
        name: this.$subscriptionName.val(),
        language: this.$subscriptionLanguage.val()
      });
    }

  });

  return SubscribeView;
});
