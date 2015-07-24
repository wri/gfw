/**
 * The Prodes loss timeline.
 *
 * @return ProdesTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineYearClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineYearClass, Presenter) {

  'use strict';

  var ProdesTimeline = TimelineYearClass.extend({

    /**
     * Get the layer spec.
     *
     * @param  {object} layer The layer object
     */
    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        player: false
      };

      ProdesTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }
  });

  return ProdesTimeline;
});
