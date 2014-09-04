/**
 * The UMD loss timeline.
 *
 * @return UMDLossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineYearClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineYearClass, Presenter) {

  'use strict';

  var UMDLossTimeline = TimelineYearClass.extend({

    /**
     * Get the layer spec.
     *
     * @param  {object} layer The layer object
     */
    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)]
      };

      UMDLossTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }
  });

  return UMDLossTimeline;
});
