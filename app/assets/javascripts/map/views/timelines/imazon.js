App.Views.ImazonTimeline = App.Views.Timeline.extend({

  opts: {
    dateRange: [moment([2007, 1, 1]), moment([2011, 8, 1])],
    layerName: 'imazon',
    xAxis: {
      months: {
        enabled: true,
        steps: true
      }
    }
  },

  initialize: function() {
    // todo => use moment for daterange in timelines
  }

});