/**
 * The Timeline view presenter.
 *
 * @return TimelinePresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var TimelinePresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function() {
        // if (place.name === 'map') {
        // }
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Used by Timelineview to delegate timeline date UI events.
     * Results in the Timeline/date-change evnet getting published with
     * the new lat/lng.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    updateTimelineDate: function(date) {
      mps.publish('Timeline/date-change', [this.view.getLayerName(), date]);
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return TimelinePresenter;

});
