/**
 * The SourceWindowPresenter class for the SourceWindowPresenter view.
 *º
 * @return SourceWindowPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SourceWindowPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Source/open': function(source) {
        this.view.showByParam(source);
      }
    }]
  });

  return SourceWindowPresenter;
});
