/**
 * The Timeline view presenter.
 *
 * @return TimelineClassPresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var TimelineClassPresenter = Class.extend({

    init: function(view) {
      this.view = view;
    },

    /**
     * Used by Timelineview to delegate timeline date UI events.
     * Results in the Timeline/date-change evnet getting published with
     * the new lat/lng.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    updateTimelineDate: function(date) {
      mps.publish('Timeline/date-change', [this.view.getName(), date]);
      mps.publish('Place/update', [{go: false}]);
    },

    startPlaying: function() {
      mps.publish('Timeline/start-playing', []);
    },

    stopPlaying: function() {
      mps.publish('Timeline/stop-playing', []);
    }

  });

  return TimelineClassPresenter;

});
