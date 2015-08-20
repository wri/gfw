/**
 * The SourceBottomPresenter class for the SourceBottomPresenter view.
 *º
 * @return SourceBottomPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SourceBottomPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Confirm/ask': function(source, response) {
        this.view.showByParam(source, response);
      }
    }],

    sendResponse: function(name,response) {
      mps.publish('Confirm/'+name, [response])
    }
  });

  return SourceBottomPresenter;
});
