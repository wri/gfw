/**
 * The UMD loss timeline.
 *
 * @return UMDLossTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'views/timeline/class/TimelineMonthClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var FormaTimeline = TimelineMonthClass.extend({

    /**
     * Get the layer spec.
     *
     * @param  {object} layer The layer object
     */
    initialize: function(layer) {
      this.presenter = new Presenter(this);
      console.log(layer);

      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)]
      };

      FormaTimeline.__super__.initialize.apply(this, [layer]);
    }
  });

  return FormaTimeline;
});
