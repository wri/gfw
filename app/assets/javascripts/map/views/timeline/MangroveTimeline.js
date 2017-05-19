/**
 * The MangroveTimeline.
 *
 * @return MangroveTimeline class (extends TimelineBtnClass)
 */
define([
  'underscore', 'moment',
  'abstract/timeline/TimelineBtnClass',
  'map/presenters/TimelineClassPresenter',
  'map/services/MangroveDateService'
], function(_, moment, TimelineBtnClass, Presenter, DatesHelper) {

  'use strict';

  var MangroveTimeline = TimelineBtnClass.extend({

    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);

      this.options = {
        dateRange: [moment().subtract(7, 'days'), moment()],
        width: 300,
        tickWidth: 110,
        tipsy: false
      };

      if (!(currentDate && currentDate[0] && currentDate[1])) {
        currentDate = [moment().subtract(24, 'hours'), moment()];
      }
      currentDate = DatesHelper.getRangeForDates(currentDate);


      MangroveTimeline.__super__.initialize.apply(this, [layer, currentDate]);
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

  return MangroveTimeline;
});
