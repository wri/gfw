/**
 * The Terra i timeline.
 *
 * @return LossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineMonthClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var TerraiTimeline = TimelineMonthClass.extend({

    /**
     * Get the layer spec.
     *
     * @param  {object} layer The layer object
     */
    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        playSpeed: 120
      };

      this.presenter = new Presenter(this);
      TerraiTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }
  });

  return TerraiTimeline;
});


