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
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)]
      };

      this.presenter = new Presenter(this);
      FormaTimeline.__super__.initialize.apply(this, [layer]);
    }

  });

  return FormaTimeline;

});
