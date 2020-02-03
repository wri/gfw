/**
 * The SourceMobileFriendlyPresenter class for the SourceMobileFriendlyPresenter view.
 *º
 * @return SourceMobileFriendlyPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SourceMobileFriendlyPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: []
  });

  return SourceMobileFriendlyPresenter;
});
