/**
 * The Presenter class. Add unsubscribe funcionallity.
 *
 * @return PresenterClass class
 */
define([
  'Class',
  'mps'
], function(Class, mps) {

  'use strict';

  var PresenterClass = Class.extend({

    init: function() {
      this._subs = [];
    },

    /**
     * Unsubscribe presenter mps subscriptions.
     */
    unsubscribe: function() {
      for (var i = 0; i < this._subs.length; i++) {
        mps.unsubscribe(this._subs[i]);
      };
    }

  });

  return PresenterClass;

});
