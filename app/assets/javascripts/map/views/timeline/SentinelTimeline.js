define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineDatePicker',
  'map/services/GladDateService'
], function(moment, TorqueTimelineClass, DatePicker, GladDateService) {

  'use strict';

  var SentinelTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker,
    dataService: GladDateService

  });

  return SentinelTimeline;

});
