/**
 * The SubscribePresenter class for the SubscribePresenter view.
 *
 * @return SubscribePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var SubscribePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Subscribe/show': function(options) {
        this.view.show(options);
      }
    }, {
      'Subscribe/hide': function() {

        this.view.hide();
      }
    }],

  });

  return SubscribePresenter;
});
