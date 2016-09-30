/**
 * The Core view.
 * @return View Backbone View
 */
define([
  'backbone',
  'underscore',
  'mps'
], function(Backbone, _, mps) {

  'use strict';

  // This view is for always having the posibility of subscribing to mps events
  var View = Backbone.View.extend({

    initialize: function(view, options) {
      options = _.extend({}, this.defaults, options);
      this._cachedSubscriptions = [];

      if (this._subscriptions) {
        this._subscribe();
      }
    },

    /**
     * Unsubscribe presenter mps subscriptions.
     */
    _unsubscribe: function() {
      if (!!this._cachedSubscriptions) {
        for (var i = 0; i < this._cachedSubscriptions.length; i++) {
          mps.unsubscribe(this._cachedSubscriptions[i]);
        }
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
    },

    _remove: function() {
      this.model && this.model.clear({ silent: true });
      this._unsubscribe && this._unsubscribe();
      this.undelegateEvents();
      this.remove();
    }

  });

  return View;
});
