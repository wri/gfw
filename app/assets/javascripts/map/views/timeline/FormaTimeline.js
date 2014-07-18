/**
 * The Forma timeline.
 *
 * @return FormaTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'views/timeline/class/TimelineMonthClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineMonthClass, Presenter) {

  'use strict';

  var FormaTimeline = TimelineMonthClass.extend({

    initialize: function(layer) {
      this.presenter = new Presenter(this);
      this.layer = layer;

      this.options = {
        dateRange: [moment([2005,0]), moment([2015, 0])]
        // dateRange: [layer.mindate, layer.maxdate]
      };

      FormaTimeline.__super__.initialize.apply(this, [layer.slug]);
    }
  });

  return FormaTimeline;
});
