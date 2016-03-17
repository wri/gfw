/**
 * The GuidePresenter class for the GuidePresenter view.
 *º
 * @return GuidePresenter class.
 */
define([
  'underscore',
  'mps',
  'cookie',  
  'map/helpers/guides',  
  'map/presenters/PresenterClass',
], function(_, mps, Cookies, guides, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      tour: null,
    },
    initialize: function() {
      this.setMobile();
    },

    setMobile: function() {      
      this.set('mobile', (window.innerWidth < window.gfw.config.GFW_MOBILE));
    }
  });


  var GuidePresenter = PresenterClass.extend({

    tours: guides,

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      this.listeners();
      mps.publish('Place/register', [this]);
    },

    listeners: function() {
      this.status.on('change:tour', this.changeTour.bind(this));
    },

    getPlaceParams: function() {
      var p = {};

      p.tour = this.status.get('tour');

      return p;
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Place/go': function(place) {
        var params = place.params;
        if (!this.status.get('mobile')) {        
          this.status.set('tour',(!!params.tour) ? this.setTour(params.tour) : null);
          this.checkCookieTour();
        }
      }
    },{
      'Tour/open': function(tour) {
        this.status.set('tour',tour);
      }
    }],

    setTour: function(tour) {
      return (!!this.tours[tour]) ? tour : 'default'
    }, 

    changeTour: function() {
      Cookies.set('tour', true, { expires: 90 });
      this.view._setTour(this.status.get('tour'));
    },

    clearTour: function() {
      this.status.set('tour', null, { silent: true });
    },

    finishTour: function() {
      mps.publish('Place/register', [this]);
    },

    checkCookieTour: function() {
      if(!this.status.get('tour') && !Cookies.get('tour')) {
        this.status.set('tour', 'default');
      }
    }


  });

  return GuidePresenter;
});
