/**
 * The Imazon timeline.
 *
 * @return ImazonTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'abstract/timeline/TimelineMonthClass',
  'map/presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var ImazonTimeline = TimelineMonthClass.extend({

    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        player: false
      };

      this.presenter = new Presenter(this);
      ImazonTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }

  });

  return ImazonTimeline;

});
