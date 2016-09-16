/**
 * The Terra i timeline.
 *
 * @return LossTimeline class (extends TimelineYearClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass',
  'abstract/timeline/TimelineMonthlyPicker',
  'map/services/TerraiDateService'
], function(moment, TorqueTimelineClass, TimelineMonthlyPicker, TerraiDateService) {

  'use strict';

  var TerraiTimeline = TorqueTimelineClass.extend({

    DatePicker: TimelineMonthlyPicker,
    dataService: TerraiDateService

  });

  return TerraiTimeline;
});
