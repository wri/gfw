define([
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'views/ModalView',
  'map/presenters/tabs/SubscribePresenter',
  'helpers/languagesHelper',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, moment, ModalView, Presenter, languagesHelper, tpl) {

  'use strict';

  var SubscribeView = ModalView.extend({

    id: '#subscriptionModal',

    className: "modal",

    template: Handlebars.compile(tpl),

    events: function(){
      return _.extend({},ModalView.prototype.events,{
        'click .subscription-sign-in': 'onClickTrackSignIn',
        'click #returnToMap': 'onClickClose',
        'click #showName': 'onClickCheckEmail',
        'click #subscribe': 'onClickSubscribe',
      });
    },

    initialize: function(){
      this.constructor.__super__.initialize.apply(this);
      this.presenter = new Presenter(this);
      this.render();
      this._cache();
      this.$body.append(this.el);
    },

    cache: function() {
      this.$spinner = this.$el.find('#modal-loader-subcribe');
      this.$subscriptionName = this.$el.find('#subscriptionName');
      this.$subscriptionLanguage = this.$el.find('#subscriptionLanguage');
      this.$subscriptionEmail = this.$el.find('#subscriptionEmail');
      this.$steps = this.$el.find('.steps');
    },

    render: function(){
      var userLang = this.presenter.user.getLanguage();
      var languagesList = languagesHelper.getListSelected(userLang);

      this.$el.html(this.template({
        apiHost: window.gfw.config.GFW_API_HOST_NEW_API,
        loggedIn: this.presenter.user.isLoggedIn(),
        email: this.presenter.user.get('email'),
        date: moment().format('MMM D, YYYY'),
        languages: languagesList,
        dataset: this.presenter.subscription &&
                 this.presenter.subscription.formattedTopic().long_title
      }));

      this.cache();
      this.renderChosen();
      return this;
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

    // Spinners
    showSpinner: function() {
      this.$spinner.toggleClass('-start', true);
    },

    hideSpinner: function() {
      this.$spinner.toggleClass('-start', false);
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
      this.hide();
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
