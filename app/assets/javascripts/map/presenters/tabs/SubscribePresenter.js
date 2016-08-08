/**
 * The SubscribePresenter class for the SubscribePresenter view.
 *
 * @return SubscribePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'map/models/UserModel',
  'connect/models/Subscription',
], function(_, mps, PresenterClass, User, Subscription) {

  'use strict';

  var SubscribePresenter = PresenterClass.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        subscribe: null
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();

      this.user = new User();
      this.user.on('sync', this.render);
      this.user.fetch()
        .done(function(){
          this.view.render();
        }.bind(this))

        .error(function(){
          this.view.render();
        }.bind(this))


      mps.publish('Place/register', [this]);
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      p.subscribe = this.status.get('subscribe');

      return p;
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        var params = place.params;
        this.status.set({
          subscribe: params.subscribe
        });
      }
    },{
      'Subscribe/show': function(status) {
        this.show(status);
      }
    }, {
      'Subscribe/hide': function() {
        this.view.hide();
      }
    },{
      'Subscribe/geom': function(geom) {
        this.geom_for_subscription = geom;
      }
    },{
      'Subscribe/reload': function() {
        this.view.refreshEmail();
      }
    }],

    /**
     * Presenter methods.
     */
    show: function(options) {
      this.refreshEmail();

      this.setSubscribeState(!this.user.isLoggedIn());       
      this.setSubscription(options);
      this.publishUpdateUrl();

      this.currentStep = 0;
      this.view.show();
    },

    hide: function() {
      this.setSubscribeState(null);
      this.publishUpdateUrl();

      (this.subscription.isNew()) ? this.publishSubscribeCancel() : this.publishSubscribeEnd();

      this.view.hide();
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

      this.view.updateCurrentStep(this.currentStep);
    },

    subscribe: function(status) {
      // Set name and language
      this.subscription.set(status);

      // Set email and save it in the user Model
      this.user.setEmailIfEmpty(this.subscription.get('resource').content);
      this.user.save({ email: this.user.attributes.email }, { patch: true });

      this.subscription.save()
          .then(this.onSubscriptionSave.bind(this))
          .fail(this.onSubscriptionFail.bind(this));
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

    refreshEmail: function() {
      if (_.isEmpty(this.user.get('email'))) {
        this.view.showSpinner();
        this.user.fetch();
      }
    },    

    // Subscription
    onSubscriptionSave: function() {
      this.view.hideSpinner();
      this.nextStep();
    },

    onSubscriptionFail: function() {
      this.view.hideSpinner();
      this.hide();
      this.publishNotification('notification-subscription-incorrect');
    },

    /**
     * PUBLISHERS
     * - publishSubscribeEnd
     * - publishSubscribeCancel
     * - publishUpdateUrl
     * - publishNotification
     */
    publishSubscribeEnd: function(){
      mps.publish('Subscribe/end');
    },

    publishSubscribeCancel: function(){
      mps.publish('Subscribe/cancel');
    },

    publishUpdateUrl: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    publishNotification: function(id){
      mps.publish('Notification/open', [id]);
    },



    /**
     * SETTERS
     * - setSubscription
     * - setSubscribeState
     */
    setSubscription: function(options) {
      var params = _.pick(options, 'iso', 'geostore', 'wdpaid', 'use', 'useid');
      this.subscription = new Subscription({
        datasets: [options.dataset],
        params: params
      });
    },

    setSubscribeState: function(to) {
      this.status.set('subscribe', to);
      this.publishUpdateUrl();
    },


  });

  return SubscribePresenter;
});
