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
      mps.subscribe('Place/go', _.bind(function(place) {
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
     * @param  {number} lat latitude
     * @param  {number} lng longitude
     */
    updateTimelineDate: function(lat, lng) {
      mps.publish('Timeline/date-change', [lat, lng]);
      mps.publish('Place/update', [{go: false}]);
    }

  });

  return TimelinePresenter;

});
