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
    _subscriptions: [{
      'Notification/open': function(source) {
        this.view.show(source);
      },
      'Notification/close': function() {
        this.view.hide();
      },
      'Notification/custom': function(info, type) {
        this.view.showCustom(info, type);
      }
    }],

    publishAction: function(action, options) {
      mps.publish(action, [options])
    }

  });

  return SourceMobileFriendlyPresenter;
});
