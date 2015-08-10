/**
 * The Modis timeline.
 *
 * @return FiresTimeline class (extends TimelineBtnClass)
 */
define([
  'underscore',
  'moment',
  'abstract/timeline/TimelineBtnClass',
  'map/presenters/TimelineClassPresenter'
], function(_, moment, TimelineBtnClass, Presenter) {

  'use strict';

  var data = [{
    start: moment().subtract(8, 'days'),
    end: moment().subtract(24, 'hours'),
    label: 'Past week',
    hoursDiff: 168
  },{
    start: moment().subtract(96, 'hours'),
    end: moment().subtract(24, 'hours'),
    label: 'Past 72 hours',
    hoursDiff: 72
  },{
    start: moment().subtract(72, 'hours'),
    end: moment().subtract(24, 'hours'),
    label: 'Past 48 hours',
    hoursDiff: 48
  },{
    start: moment().subtract(48, 'hours'),
    end: moment().subtract(24, 'hours'),
    label: 'Past 24 hours',
    hoursDiff: 24
  }];

  var FiresTimeline = TimelineBtnClass.extend({

    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment().subtract(8, 'days'), moment()],
        width: 550,
        tickWidth: 110,
        tipsy: false
      };

      if (currentDate) {
        currentDate = this.setCurrentDate(currentDate);
      }

      FiresTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    },

    /**
     * To make fires layer bookmarkable we need to
     * convert the url date to current valid dates.
     * eg. last month day 29 to 30 should be last 24 hours.
     *
     *
     * @param {Array} currentDate [moment, moment]
     */
    setCurrentDate: function(currentDate) {
      var hoursDiff = moment(currentDate[1]).diff(currentDate[0], 'hours');
      var dataItem = _.findWhere(data, {hoursDiff: hoursDiff});
      currentDate = [dataItem.start, dataItem.end];
      return currentDate;
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      return data;
    }
  });

  return FiresTimeline;
});
