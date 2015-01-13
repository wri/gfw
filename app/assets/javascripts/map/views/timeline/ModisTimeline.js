/**
 * The Modis timeline.
 *
 * @return ModisTimeline class (extends TimelineBtnClass)
 */
define([
  'underscore',
  'moment',
  'abstract/timeline/TimelineBtnClass',
  'map/presenters/TimelineClassPresenter'
], function(_, moment, TimelineBtnClass, Presenter) {

  'use strict';

  var ModisTimeline = TimelineBtnClass.extend({

    initialize: function(layer, currentDate) {
      this.presenter = new Presenter(this);
      this.options = {
        dateRange: [layer.mindate, layer.maxdate],
        tickWidth: 60
      };
      ModisTimeline.__super__.initialize.apply(this, [layer, currentDate]);
    },

    /**
     * Get array of quarterly dates.
     *
     * @return {array} Array of quarterly.
     */
    _getData: function() {
      var data = [];

      while(1) {
        if (data.length > 0 && _.last(data).end.clone().add(1,'month').endOf('month')
          .isAfter(this.options.dateRange[1])) {
          break;
        }
        data.push(this._getDataItem(data));
      }

      return data;
    },

    _getDataItem: function(data) {
      var date = this.options.dateRange;
      var d = {};

      if (data.length < 1) {
        d.start = date[0].clone();
        d.end = date[0].clone().add(2, 'month').endOf('month');
      } else {
        d.start = _.last(data).end.clone().add(1, 'month').startOf('month');
        d.end = _.last(data).end.clone().add(3, 'month').endOf('month');
      }

      var quarter = (d.end.month() + 1) / 3;
      d.label = '{0} Q{1}'.format(d.end.year(), quarter);

      return d;
    }
  });

  return ModisTimeline;
});
