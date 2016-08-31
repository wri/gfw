/**
 * The Terra i timeline.
 *
 * @return LossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineDatePicker',
  'map/services/TerraiDateService'
], function(moment, TorqueTimelineClass, DatePicker, TerraiDateService) {

  'use strict';

  var TerraiTimeline = TorqueTimelineClass.extend({

    DatePicker: DatePicker,
    dataService: TerraiDateService

  });

  return TerraiTimeline;
});
