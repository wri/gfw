/**
 * The SubscribePresenter class for the SubscribePresenter view.
 *
 * @return SubscribePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'helpers/gaEventsHelper',
  'models/UserModel',
  'helpers/datasetsHelper',
  'map/services/CoverageService',
  'connect/models/Subscription',
], function(_, mps, PresenterClass, GaEventsHelper,
  User, datasetsHelper, CoverageService, Subscription) {

  'use strict';

  var SubscribePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();

      this.user = new User();
      this.user.fetch({
        success: function () {
          this.view.render();
        }.bind(this),
        error: function () {
          this.view.render();
        }.bind(this)
      });

      this.listeners();

      mps.publish('Place/register', [this]);
    },

    listeners: function() {
      this.view.model.on('change:hidden', this.changeHidden.bind(this));
    },

    /**
     * MODEL CHANGES
     * - changeHidden
    */
    changeHidden: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      p.subscribe = ! !!this.view.model.get('hidden') || null;

      return p;
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Subscribe/show': function(analysisStatus) {
        this.setSubscription(analysisStatus);
        this.currentStep = 0;
        this.view.render();
        this.view.show();
      }
    }, {
      'Subscribe/hide': function() {
        this.currentStep = 0;
        this.view.hide();
      }
    }],

    nextStep: function(index) {
      if (this.currentStep === undefined) {
        this.currentStep = 0;
      }

      if (index !== undefined && _.isNumber(index)) {
        this.currentStep = index;
      } else {
        this.currentStep += 1;
      }

      this.view.updateCurrentStep(this.currentStep);
    },

    previousStep: function() {
      this.currentStep -= 1;

      this.view.updateCurrentStep(this.currentStep);
    },

    // Email or URL (Webhook)
    checkEmailOrURL: function(params) {
      var type = 'EMAIL';
      var content = params.email;

      if (params.url && params.url.length > 0) {
        type = 'URL';
        content = params.url;

        this.getDatasets();
        this.nextStep();
      } else {
        if (params.email || this.subscription.hasValidEmail()) {
          this.getDatasets();
          this.nextStep();
        } else {
          this.publishNotification('notification-email-incorrect');
        }
      }

      this.subscription.set('resource', {
        type: type,
        content: content
      });
    },

    goBack: function () {
      this.previousStep();
    },

    getDatasets: function() {
      if (typeof this.subscription !== 'undefined') {
        var params = this.subscription.attributes.params;
        params = _.extend({}, params, params.iso);
        var paramsValues = _.pick(params, 'use', 'useid', 'wdpaid',
          'geostore', 'country', 'region');

        var values = _.compact(_.values(paramsValues));

        if (values.length) {
          this.view.renderDatasets({
            datasets: []
          });

          CoverageService.get(params)
            .then(function(layers) {
              this.view.renderDatasets({
                datasets: datasetsHelper.getFilteredList(layers, this.subscription.attributes.datasets)
              });
            }.bind(this))

            .error(function(error) {
              console.log(error);
            }.bind(this));
        } else {
          this.view.renderDatasets({
            datasets: datasetsHelper.getListSelected(this.subscription.attributes.datasets)
          });
        }
      }

    },

    updateDatasets: function(datasets) {
      this.subscription.set({
        datasets: datasets
      }, { silent: true });
    },

    checkDatasets: function() {
      if (this.subscription.attributes.datasets.length) {
        this.nextStep();
      } else {
        this.publishNotification('notification-my-gfw-subscription-dataset-required');
      }
    },

    // Subscription
    saveSubscription: function(status) {
      // Set name and language
      this.subscription.set(status);

      // Set email and save it in the user Model
      this.user.setEmailIfEmpty(this.subscription.get('resource').content);
      this.user.setLanguageIfEmpty(this.subscription.get('language'));

      this.user.save({
        email: this.user.attributes.email,
        language: this.user.attributes.language
      }, { patch: true });

      this.subscription.save()
          .then(this.onSubscriptionSave.bind(this))
          .fail(this.onSubscriptionFail.bind(this));
    },

    onSubscriptionSave: function() {
      this.view.hideSpinner();
      this.trackEvent();
      this.nextStep();
    },

    onSubscriptionFail: function() {
      this.hide();
      this.publishNotification('notification-subscription-incorrect');
    },

    trackEvent: function() {
      var subscription = this.subscription.toJSON();
      var params = subscription.params;

      if (params) {
        var eventData = GaEventsHelper.getSubscription(params);
        ga('send', 'event', 'Subscribe', 'Save subscription', eventData);
      }
    },


    /**
     * PUBLISHERS
     * - publishNotification
    */
    publishNotification: function(id){
      mps.publish('Notification/open', [id]);
    },



    /**
     * SETTERS
     * - setSubscription
     */
    setSubscription: function(analysisStatus) {
      var params = _.pick(analysisStatus, 'iso', 'geostore', 'wdpaid', 'use', 'useid');

      this.subscription = new Subscription({
        datasets: [analysisStatus.dataset],
        params: params
      });
    },

  });

  return SubscribePresenter;
});
