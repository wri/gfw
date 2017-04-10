/**
 * The Forma timeline.
 *
 * @return FormaTimeline class (extends TimelineMonthClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineDatePicker',
  'map/services/GladDateService'
], function(moment, TorqueTimelineClass, DatePicker, GladDateService) {

  'use strict';

  var FormaTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker,
    dataService: GladDateService // TODO: create service for forma available dates

  });

  return FormaTimeline;

});

