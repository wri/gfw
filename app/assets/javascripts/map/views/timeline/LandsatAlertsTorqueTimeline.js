/**
 * The Landsat Alerts timeline.
 *
 * @return LandsatAlertsTorqueTimeline class (extends * TorqueTimelineClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass'
], function(moment, TorqueTimelineClass) {

  'use strict';

  var LandsatAlertsTorqueTimeline = TorqueTimelineClass.extend({

    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        player: false
      };

      LandsatAlertsTorqueTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    }

  });

  return LandsatAlertsTorqueTimeline;

});
