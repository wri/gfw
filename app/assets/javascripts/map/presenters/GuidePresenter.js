/**
 * The GuidePresenter class for the GuidePresenter view.
 *º
 * @return GuidePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      tour: null,
    }
  });


  var GuidePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
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
        this._onPlaceGo(place);
      }
    }],

    _onPlaceGo: function(place) {
      var params = place.params;
      this.status.set('tour', (!!params.tour) ? true : null);
      this.view.setTour();
      this.view.initTour();
    }

  });

  return GuidePresenter;
});
