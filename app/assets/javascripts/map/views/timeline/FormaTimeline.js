/**
 * The Forma timeline.
 *
 * @return FormaTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineMonthClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var FormaTimeline = TimelineMonthClass.extend({

    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        playSpeed: 120
      };

      this.presenter = new Presenter(this);
      FormaTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }

  });

  return FormaTimeline;

});
