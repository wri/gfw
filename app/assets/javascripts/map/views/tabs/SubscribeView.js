define([
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'views/ModalView',
  'map/presenters/tabs/SubscribePresenter',
  'helpers/languagesHelper',
  'text!map/templates/tabs/subscribeDatasets.handlebars',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, moment, ModalView,
  Presenter, languagesHelper, subscribeDatasetsTpl, tpl) {

  'use strict';

  var SubscribeView = ModalView.extend({

    id: '#subscriptionModal',

    className: "modal",

    template: Handlebars.compile(tpl),

    templateDatasets: Handlebars.compile(subscribeDatasetsTpl),

    events: function(){
      return _.extend({},ModalView.prototype.events,{
        'click .subscription-sign-in': 'onClickTrackSignIn',
        'click #returnToMap': 'onClickClose',
        'click #showName': 'onClickCheckEmail',
        'click #datasets': 'onClickCheckDatasets',
        'change .dataset-checkbox' : 'onChangeDataset',
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
      this.$subscriptionUrl = this.$el.find('#subscriptionUrl');
      this.$subscriptionDatasets = this.$el.find('#subscription-datasets');
      this.$steps = this.$el.find('.steps');
    },

    render: function(){
      this.presenter.user.checkLogged()
        .then(function() {
          this.renderTemplate(true);
        }.bind(this))

        .catch(function(e) {
          this.renderTemplate(false);
        }.bind(this));
    },

    renderTemplate: function (loggedIn) {
      var userLang = this.presenter.user.getLanguage();
      var languagesList = languagesHelper.getListSelected(userLang);
      var dataset = this.presenter.subscription &&
      this.presenter.subscription.formattedTopic() ?
        this.presenter.subscription.formattedTopic().long_title : '';

      this.$el.html(this.template({
        apiHost: window.gfw.config.GFW_API_AUTH,
        loggedIn: loggedIn,
        email: this.presenter.user.get('email'),
        date: moment().format('MMM D, YYYY'),
        languages: languagesList,
        dataset: dataset
      }));

      this.cache();
      this.renderChosen();
    },

    renderDatasets: function(data) {
      this.$subscriptionDatasets.html(this.templateDatasets(data));
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
     * - onClickCheckDatasets
     * - onChangeDataset
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
      this.presenter.checkEmailOrURL({
        email: this.$subscriptionEmail.val(),
        url: this.$subscriptionUrl.val()
      });
    },

    onClickCheckDatasets: function(e) {
      this.presenter.checkDatasets();
    },

    onChangeDataset: function(e) {
      e && e.preventDefault();
      var $datasetCheckboxs = this.$el.find('.dataset-checkbox');

      var datasets = _.compact(_.map($datasetCheckboxs, function(el) {
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      this.presenter.updateDatasets(_.clone(datasets));
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
