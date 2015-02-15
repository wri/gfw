/**
 * The SpinnerTabsPresenter class for the SpinnerTabsPresenter view.
 *
 * @return SpinnerTabsPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var SpinnerTabsPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Spinner/start': function() {
        console.log('start2')
        this.view.start();
      }
    }, {
      'Spinner/stop': function() {
        this.view.stop();
      }
    }],

  });

  return SpinnerTabsPresenter;
});
