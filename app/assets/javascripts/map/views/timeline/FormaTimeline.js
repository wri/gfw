/**
 * The Forma timeline.
 *
 * @return FormaTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineDatePicker',
  'map/services/FormaDateService'
], function(moment, TorqueTimelineClass, DatePicker, FormaDateService) {

  'use strict';

  var FormaTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker,
    dataService: FormaDateService

  });

  return FormaTimeline;

});

