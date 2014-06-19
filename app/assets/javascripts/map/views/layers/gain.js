/**
 * The Imazon layer module for use on canvas.
 *
 * @return GainLayer class (extends CartodbLayer)
 */
define([
  'backbone',
  'views/layers/core/imageLayer',
  'views/timeline',
  'moment'
], function(Backbone, ImageLayer, Timeline, moment) {

  var GainLayer = ImageLayer.extend({

    initialize: function() {
      this.dataMaxZoom = 19;
      this.name = "gain";
      GainLayer.__super__.initialize.apply(this);

      this.url = 'http://earthengine.google.org/static/hansen_2013/gain_alpha/%z/%x/%y.png';
    }

  });

  return GainLayer;

});