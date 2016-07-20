define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/GladTimelineDatePicker'
], function(moment, TorqueTimelineClass, DatePicker) {

  'use strict';

  var GladTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker

  });

  return GladTimeline;

});

