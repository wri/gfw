/**
 * The Presenter class. Add unsubscribe funcionallity.
 *
 * @return PresenterClass class
 */
define([
  'underscore',
  'Class',
  'mps'
], function(_, Class, mps) {

  'use strict';

  var PresenterClass = Class.extend({

    init: function(view, options) {
      options = _.extend({}, {register: false}, options);
      this._cachedSubscriptions = [];

      if (this._subscriptions) {
        this._subscribe();
      }
    },

    /**
     * Unsubscribe presenter mps subscriptions.
     */
    unsubscribe: function() {
      for (var i = 0; i < this._cachedSubscriptions.length; i++) {
        mps.unsubscribe(this._cachedSubscriptions[i]);
      }
    },

    /**
     * Subscribe to events and append them to this._subs.
     */
    _subscribe: function() {
      _.each(this._subscriptions, _.bind(function(subscription) {
        _.each(subscription, _.bind(function(callback, name) {
          this._cachedSubscriptions.push(
            mps.subscribe(name, _.bind(callback, this)));
        },this));
      }, this));
    }

  });

  return PresenterClass;
});
