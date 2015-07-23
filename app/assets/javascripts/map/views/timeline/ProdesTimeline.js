/**
 * The Imazon timeline.
 *
 * @return ImazonTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineYearClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var ProdesTimeline = TimelineMonthClass.extend({

    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        player: false
      };

      this.presenter = new Presenter(this);
      ProdesTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }

  });

  return ProdesTimeline;

});