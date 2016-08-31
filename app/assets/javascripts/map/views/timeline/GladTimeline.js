define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineDatePicker',
  'map/services/GladDateService'
], function(moment, TorqueTimelineClass, DatePicker, GladDateService) {

  'use strict';

  var GladTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker,
    dataService: GladDateService

  });

  return GladTimeline;

});
