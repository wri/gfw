/**
 * The Terra i timeline.
 *
 * @return LossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineYearClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineYearClass, Presenter) {

  'use strict';

  var TerraiTimeline = TimelineYearClass.extend({

    /**
     * Get the layer spec.
     *
     * @param  {object} layer The layer object
     */
    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);
      console.log(layer);
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)]
      };

      TerraiTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }
  });

  return TerraiTimeline;
});
