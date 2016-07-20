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
        subscribe: false
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();

      this.user = new User();
      this.user.on('sync', this.render);
      this.user.fetch();

      mps.publish('Place/register', [this]);
    },

    /**
     * Presenter methods.
     */
     refreshEmail: function() {
       if (_.isEmpty(this.user.get('email'))) {
         this.view.showSpinner();
         this.user.fetch();
       }
     },

     show: function(options) {
       this.refreshEmail();

       if (!this.user.isLoggedIn()) {
         this.setSubscribeState();
       }
       this.updateUrl();

       this.createSubscription(options);
       this.currentStep = 0;
       this.view.show();
     },

     close: function() {
       this.unSetSubscribeState();
       this.updateUrl();

       if (this.subscription.isNew()) {
         this.subscribeCancel();
       } else {
         this.subscribeEnd();
       }
       this.view.setClose();
     },

     createSubscription: function(options) {
      var params = _.pick(options,
        'iso', 'geostore', 'wdpaid', 'use', 'useid');

      this.subscription = new Subscription({
        datasets: [options.dataset],
        geostoreId: options.geostore,
        params: params
      });
     },

     subscribe: function(name) {
       this.subscription.set('name', name);

       this.user.setEmailIfEmpty(this.subscription.get('resource').content);
       this.user.save({ email: this.user.attributes.email }, { patch: true });

       this.subscription.save()
        .then(this.onSave.bind(this))
        .fail(this.close.bind(this));
     },

     askForName: function(email) {
       this.subscription.set('resource', {
        type: 'EMAIL',
        content: email
      });

      if (this.subscription.hasValidEmail()) {
        this.nextStep();
      } else {
        this.notificate('notification-email-incorrect');
      }
     },

     onSave: function() {
       this.view.hideSpinner();
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

       this.view.updateCurrentStep(this.currentStep);
     },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Subscribe/show': function(status) {
        this.show(status);
      }
    }, {
      'Subscribe/hide': function() {
        this.view.close();
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

    subscribeEnd: function(){
      mps.publish('Subscribe/end');
    },

    subscribeCancel: function(){
      mps.publish('Subscribe/cancel');
    },

    updateUrl: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    setSubscribeState: function() {
      this.status.set('subscribe', true);
      this.updateUrl();
    },

    unSetSubscribeState: function() {
      this.status.set('subscribe', null);
      this.updateUrl();
    },

    /**
     * Used by PlaceService to get the current iso/geom params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      var p = {};

      if (this.view.isOpen()) {
        p.tab = 'analysis-tab';
      }

      p.subscribe = this.status.get('subscribe');

      return p;
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    }

  });

  return SubscribePresenter;
});
