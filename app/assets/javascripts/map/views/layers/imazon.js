/**
 * The Imazon layer module for use on canvas.
 *
 * @return ImazonLayer class (extends CartodbLayer)
 */
define([
  'backbone',
  'views/layers/core/cartodbLayer',
  'views/timeline',
  'moment'
], function(Backbone, CartodbLayer, Timeline, moment) {

  var ImazonLayer = CartodbLayer.extend({

    initialize: function() {
      this.layerName = "imazon";
      this.url = 'dyynnn89u7nkm.cloudfront.net';
      this.table = 'imazon_clean2';
      this.global_version = 6;
      ImazonLayer.__super__.initialize.apply(this);

      this.timeline = new Timeline({
        dateRange: [moment([2007, 1, 1]), moment([2011, 8, 1])],
        layerName: 'imazon'
      });
    }

  });

  return ImazonLayer;

});