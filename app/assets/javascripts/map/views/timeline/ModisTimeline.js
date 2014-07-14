/**
 * The Modis timeline.
 *
 * @return ModisTimeline class (extends TimelineBtnClass)
 */
define([
  'moment',
  'views/timeline/class/TimelineBtnClass',
  'presenters/TimelineClassPresenter'
], function(moment, TimelineBtnClass, Presenter) {

  'use strict';

  var ModisTimeline = TimelineBtnClass.extend({

    options: {
      dateRange: [moment([2011, 9]), moment([2014, 2])],
      tickWidth: 60
    },

    initialize: function(layer) {
      this.presenter = new Presenter(this);
      ModisTimeline.__super__.initialize.apply(this, [layer]);
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      // var monthsCount = this.options.dateRange[1]
      //   .diff(this.options.dateRange[0], 'months', true);

      // monthsCount = Math.round((months) / 3);
      var results = [];

      var range = {
        start: this.options.dateRange[0].clone(),
        end: this.options.dateRange[0].add(2, 'month').clone()
      };

      results.push(range);

      while(1) {
        range = {
          start: range.end.clone().add(1, 'month'),
          end: range.end.clone().add(3, 'month')
        };

        if (range.end.isAfter(this.options.dateRange[1])) {
          break;
        }

        results.push(range);
      }

      return results;
    },

    _getTickFormat: function(d) {
      return '{0} Q{1}'.format(2013, d);
    }
  });

  return ModisTimeline;
});
