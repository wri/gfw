/**
 * The FORMA 250 Alerts timeline.
 *
 * @return Forma250Timeline class (extends * TorqueTimelineClass)
 */
define([
  'moment',
  'abstract/timeline/TorqueTimelineClass'
], function(moment, TorqueTimelineClass) {

  'use strict';

  var Forma250Timeline = TorqueTimelineClass.extend({

    initialize: function(layer, currentDate) {
      this.options = {
        dateRange: [moment(layer.mindate), moment(layer.maxdate)],
        player: false
      };

      Forma250Timeline.__super__.initialize.apply(this, [layer, currentDate]);
    }

  });

  return Forma250Timeline;

});
