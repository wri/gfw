/**
 * The SharePresenter class for the SharePresenter view.
 *
 * @return SharePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var SharePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/update': function(place) {
        if (!this.view.model.get('hidden')) {
          this.view.setUrls();
        }
      }
    }],

  });

  return SharePresenter;
});
