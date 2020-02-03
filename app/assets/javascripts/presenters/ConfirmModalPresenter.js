/**
 * The ConfirmModalPresenter class for the ConfirmModalPresenter view.
 *º
 * @return ConfirmModalPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var ConfirmModalPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: []

  });

  return ConfirmModalPresenter;
});
