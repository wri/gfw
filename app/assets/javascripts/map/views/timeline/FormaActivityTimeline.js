/**
 * The FormaActivityTimeline.
 *
 * @return FormaActivityTimeline class (extends TimelineBtnClass)
 */
define([
  'underscore', 'moment',
  'abstract/timeline/TimelineBtnClass',
  'map/presenters/TimelineClassPresenter',
  'map/helpers/timelineDatesHelper'
], function(_, moment, TimelineBtnClass, Presenter, DatesHelper) {

  'use strict';

  var AVAILABLE_DATE_RANGES = [{
    start: moment().subtract(1, 'months').utc(),
    end: moment().utc(),
    label: 'past month',
    duration: 0
  }, {
    start: moment().subtract(7, 'days').utc(),
    end: moment().utc(),
    label: 'past week',
    duration: 168
  }, {
    start: moment().subtract(2, 'days').utc(),
    end: moment().utc(),
    label: 'past 48 hours',
    duration: 48
  }];

  var FormaActivityTimeline = TimelineBtnClass.extend({

    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment().subtract(7, 'days'), moment()],
        width: 550,
        tickWidth: 110,
        tipsy: false
      };

      if (!(currentDate && currentDate[0] && currentDate[1])) {
        currentDate = [moment().subtract(2, 'days').utc(), moment.utc()];
      }
      currentDate = DatesHelper.getRangeForDates(currentDate, AVAILABLE_DATE_RANGES);

      FormaActivityTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      return DatesHelper.dateRanges(AVAILABLE_DATE_RANGES);
    }
  });

  return FormaActivityTimeline;
});
