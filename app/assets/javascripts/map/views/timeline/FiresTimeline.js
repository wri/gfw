/**
 * The Modis timeline.
 *
 * @return FiresTimeline class (extends TimelineBtnClass)
 */
define([
  'moment',
  'views/timeline/class/TimelineBtnClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineBtnClass, Presenter) {

  'use strict';

  var FiresTimeline = TimelineBtnClass.extend({

    initialize: function(layer) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment().subtract(8, 'days'), moment()],
        width: 550,
        tickWidth: 110,
        tipsy: false
      };

      FiresTimeline.__super__.initialize.apply(this, [layer]);
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      var data = [{
        start: moment().subtract(8, 'days'),
        end: moment(),
        label: 'Past week'
      },{
        start: moment().subtract(96, 'hours'),
        end: moment(),
        label: 'Past 72 hours'
      },{
        start: moment().subtract(72, 'hours'),
        end: moment(),
        label: 'Past 48 hours'
      },{
        start: moment().subtract(48, 'hours'),
        end: moment(),
        label: 'Past 24 hours'
      }];

      return data;
    }
  });

  return FiresTimeline;
});
