/**
 * The UMD loss timeline.
 *
 * @return UMDLossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'views/timeline/class/TimelineYearClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineYearClass, Presenter) {

  'use strict';

  var UMDLossLayer = TimelineYearClass.extend({

    opts: {
      dateRange: [moment([2001]), moment()]
    },

    /**
     * Get the layer spec
     * @param  {object} layer The layer object
     */
    initialize: function(layer) {
      this.presenter = new Presenter(this);
      UMDLossLayer.__super__.initialize.apply(this, [layer]);
    }
  });

  return UMDLossLayer;
});
