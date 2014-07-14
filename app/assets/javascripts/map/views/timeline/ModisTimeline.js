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
      var data = [];

      // First date
      var range = {
        start: this.options.dateRange[0].clone(),
        end: this.options.dateRange[0].clone().add(2, 'month')
      };

      data.push(range);

      while(1) {
        range = {
          start: range.end.clone().add(1, 'month'),
          end: range.end.clone().add(3, 'month')
        };

        if (range.end.isAfter(this.options.dateRange[1])) {
          break;
        }

        data.push(range);
      }

      return data;
    },

    /**
     * @override
     */
    _getTickText: function(d, i) {
      var quarter = (d.end.month() + 1) / 3;
      return '{0} Q{1}'.format(d.end.year(), quarter);
    }
  });

  return ModisTimeline;
});
