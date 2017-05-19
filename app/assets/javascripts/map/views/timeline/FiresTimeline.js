/**
 * The FiresTimeline.
 *
 * @return FiresTimeline class (extends TimelineBtnClass)
 */
define([
  'underscore', 'moment',
  'abstract/timeline/TimelineBtnClass',
  'map/presenters/TimelineClassPresenter',
  'map/helpers/timelineDatesHelper'
], function(_, moment, TimelineBtnClass, Presenter, DatesHelper) {

  'use strict';

  var FiresTimeline = TimelineBtnClass.extend({

    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment().subtract(7, 'days'), moment()],
        width: 550,
        tickWidth: 110,
        tipsy: false
      };

      if (!(currentDate && currentDate[0] && currentDate[1])) {
        currentDate = [moment().subtract(24, 'hours'), moment()];
      }
      currentDate = DatesHelper.getRangeForDates(currentDate);


      FiresTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      return DatesHelper.dateRanges();
    }
  });

  return FiresTimeline;
});
