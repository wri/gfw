/**
 * The SourceModalPresenter class for the SourceModalPresenter view.
 *º
 * @return SourceModalPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SourceModalPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Source/open': function(source) {
        this.view.sourceStatic(source);
      }
    }],

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

  });

  return SourceModalPresenter;
});
