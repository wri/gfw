/**
 * The SubscribePresenter class for the SubscribePresenter view.
 *
 * @return SubscribePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'models/UserModel',
  'connect/models/Subscription',
], function(_, mps, PresenterClass, User, Subscription) {

  'use strict';

  var SubscribePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();

      this.user = new User();
      this.user.fetch()
        .done(function(){
          this.view.render();
        }.bind(this))

        .error(function(){
          this.view.render();
        }.bind(this))

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
        this.view.show();
      }
    }, {
      'Subscribe/hide': function() {
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

    // Email
    checkEmail: function(email) {
      this.subscription.set('resource', {
        type: 'EMAIL',
        content: email
      });

      if (this.subscription.hasValidEmail()) {
        this.nextStep();
      } else {
        this.publishNotification('notification-email-incorrect');
      }
    },

    // Subscription
    saveSubscription: function(status) {
      // Set name and language
      this.subscription.set(status);

      // Set email and save it in the user Model
      this.user.setEmailIfEmpty(this.subscription.get('resource').content);
      this.user.save({ email: this.user.attributes.email }, { patch: true });

      this.subscription.save()
          .then(this.onSubscriptionSave.bind(this))
          .fail(this.onSubscriptionFail.bind(this));
    },

    onSubscriptionSave: function() {
      this.view.hideSpinner();
      this.nextStep();
    },

    onSubscriptionFail: function() {
      this.hide();
      this.publishNotification('notification-subscription-incorrect');
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
