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
      position: 0,
      steps: null
    },

    tours: guides,

    initialize: function() {
      this.setMobile();
    },

    setMobile: function() {
      this.set('mobile', (window.innerWidth < window.gfw.config.GFW_MOBILE));
    },

    setSteps: function() {
      this.set('steps', this.getSteps());
    },

    getSteps: function() {
      var tour = this.get('tour');
      return (!!this.tours[tour]) ? this.tours[tour] : this.tours['default'];
    },
  });


  var GuidePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      this.listeners();
      mps.publish('Place/register', [this]);
    },

    listeners: function() {
      this.status.on('change:tour', this.changeTour.bind(this));

      this.status.on('change:position',this.changePosition.bind(this));
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
          this.status.set('tour',(!!params.tour) ? this.getTour(params.tour) : null);
          this.checkCookieTour();
        }
      }
    },{
      'Tour/open': function(tour) {
        this.status.set('tour',tour);
      }
    },{
      'Tab/toggle': function() {
        if (!!this.status.get('tour')) {        
          setTimeout(function(){
            this.view.updateMask();
          }.bind(this), 50);
        }        
      }
    },{
      'Analysis/subtab': function() {
        if (!!this.status.get('tour')) {        
          setTimeout(function(){
            this.view.updateMask();
          }.bind(this), 50);
        }        
      }
    },{
      'Analysis/results': function() {
        if (!!this.status.get('tour')) {        
          setTimeout(function(){
            this.view.updateMask();
          }.bind(this), 50);
        }
      }
    },{
      'Analysis/results-error': function() {
        if (!!this.status.get('tour')) {        
          setTimeout(function(){
            this.view.updateMask();
          }.bind(this), 50);
        }
      }
    }],

    getTour: function(tour) {
      return (!!this.status.tours[tour]) ? tour : 'default'
    },

    changeTour: function() {
      mps.publish('Place/update', [this]);
      Cookies.set('tour', true, { expires: 90 });
      this.status.setSteps();
      this.view.start();
    },

    changePosition: function() {
      this.view.updatePosition();
    },

    clearTour: function() {
      // Only send the mps if the current tour is the default one
      if (this.status.get('tour') === 'default') {
        // Pulse button
        mps.publish('Tour/finish');
      }

      this.status.set('tour', null, { silent: true });
      this.status.set('steps', null, { silent: true });
      this.status.set('position', 0, { silent: true });

      mps.publish('Place/update', [this]);
    },

    checkCookieTour: function() {
      if(!this.status.get('tour') && !Cookies.get('tour')) {
        this.status.set('tour', 'default');
      }
    },

    goToNextStep: function() {
      var position = this.status.get('position');

      if (position == this.status.get('steps').length - 1) {
        this.view.stop();
      } else {
        position++;
        this.status.set('position', position);
      }
    },

    goToPrevStep: function() {
      var position = this.status.get('position');

      if (position > 0) {
        position--;
        this.status.set('position', position);
      }
    }


  });

  return GuidePresenter;
});
