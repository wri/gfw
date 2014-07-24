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

    options: {
      dateRange: [moment([2006, 0]), moment([2015, 0])]
    },

    initialize: function(layer) {
      this.presenter = new Presenter(this);
      FormaTimeline.__super__.initialize.apply(this, [layer]);
    }

  });

  return FormaTimeline;

});
