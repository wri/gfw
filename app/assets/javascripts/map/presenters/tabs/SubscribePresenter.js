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

  var SubscribePresenter = PresenterClass.extend({

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
       var analysisResource = options.analysisResource,
           geostoreId = options.geostore;

       this.subscription = new Subscription({
         topic: TOPICS[options.baselayer.slug] || options.baselayer.title,
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
             geom = this.geom_for_subscription;
           }
         }
         this.subscription.set('geom', geom);
       }

       if (geostoreId) {
         this.subscription.set('geostore_id', geostoreId);
       }
     },

     subscribe: function(name) {
       this.subscription.set('name', name);

       this.stopListening(this.user);
       this.user.setEmailIfEmpty(this.subscription.get('email'));
       this.user.save();

       this.subscription.save().
         then(this.onSave.bind(this)).
         fail(this.close.bind(this));
     },

     askForName: function(email) {
       this.subscription.set('email', email);

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
      'Subscribe/show': function(options) {
        this.show(options);
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
      this.subscribe = true;
      this.updateUrl();
    },

    unSetSubscribeState: function() {
      delete this.subscribe;
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

      p.subscribe = this.subscribe;

      return p;
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    }

  });

  return SubscribePresenter;
});
