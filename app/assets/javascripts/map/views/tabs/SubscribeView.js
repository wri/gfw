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
      'click #showName': 'onClickAskForName',
      'click #subscribe': 'onClickSubscribe',
    },

    initialize: function(){
      this.presenter = new Presenter(this);
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

      this.$('#subscriptionLanguage').chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        disable_search: true,
        no_results_text: 'Oops, nothing found!'
      });

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
      this.$subscriptionLanguage = this.$el.find('#subscriptionLanguage');
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
     * UI EVENTS
     * - onClickClose
     * - onClickTrackSignIn
     * - onClickAskForName
     * - onClickSubscribe
     * @param  {[object]} e
     */
    onClickClose: function(e) {
      if (e !== undefined && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.presenter.close();
    },

    onClickTrackSignIn: function(e) {
      window.ga('send', 'event', 'User Profile', 'Signin', 'menu');
    },

    onClickAskForName: function(e) {
      this.presenter.askForName(this.$subscriptionEmail.val());
    },

    onClickSubscribe: function(e) {
      this.showSpinner();

      this.presenter.subscribe(
        this.$subscriptionName.val(),
        this.$subscriptionLanguage.val()
      );
    }

  });

  return SubscribeView;
});
