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
      dateRange: [moment([2012, 0, 1]), moment([2013, 11, 31])],
    },

    /**
     * Return array month tick values.
     * 0 = jan
     * [
     *   {year: 2013, months:[0,2], q: 1}
     * ]
     * 
     * @return {[type]} [description]
     */
    _getData: function() {
      var dateRange = this.options.dateRange;
      var months = this.options.dateRange[1]
        .diff(this.options.dateRange[0], 'months', true);
      
      months = Math.round((months) / 3);
      var result = [];

      for (var i = 0; i < months; i++) {
        result.push(i);
      };

      return result;
    },

    _getTickFormat: function(d) {
      return '{0} Q{1}'.format(2013, d);
    },

    /**
     * Get the layer spec
     * @param  {object} layer The layer object
     */
    initialize: function(layer) {
      this.presenter = new Presenter(this);
      ModisTimeline.__super__.initialize.apply(this, [layer]);
    }
  });

  return ModisTimeline;
});