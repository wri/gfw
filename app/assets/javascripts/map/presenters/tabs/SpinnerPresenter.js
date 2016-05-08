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
      'Spinner/start': function(allowCancel) {
        this.view.start();

        if (allowCancel === false) {
          this.view.$el.find('button').hide();
        } else {
          this.view.$el.find('button').show();
        }
      }
    }, {
      'Spinner/stop': function() {
        this.view.stop();
      }
    }],

    cancel: function() {
      mps.publish('Spinner/cancel');
    }

  });

  return SpinnerTabsPresenter;
});
