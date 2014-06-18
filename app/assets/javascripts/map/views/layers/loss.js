/**
 * The loss layer module for use on canvas.
 *
 * @return LossLayer class (extends CanvasLayer)
 */
define([
  'backbone',
  'mps',
  'presenter',
  'views/layers/core/canvasLayer',
  'views/timeline'
], function(Backbone, mps, presenter, CanvasLayer, Timeline) {

  var LossLayer = CanvasLayer.extend({

    initialize: function() {
      this.dataMaxZoom = 12;
      this.name = "loss";
      this.url = 'http://earthengine.google.org/static/hansen_2013/gfw_loss_year/%z/%x/%y.png';
      LossLayer.__super__.initialize.apply(this);

      this.timeline = new Timeline({
        dateRange: [2001, 2013],
        layerName: 'loss'
      });
  
    },

    filterCanvasImage: function(imgdata, w, h) {
      var components = 4,
          z = presenter.get('zoom'),
          timelineDate = presenter.get('timelineDate') || this.timeline.opts.dateRange;

      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * components,
              yearLoss = imgdata[pixelPos],
              yearStart = timelineDate[0],
              yearEnd = timelineDate[1];

          yearLoss = 2000 + yearLoss;

          if (imgdata[pixelPos + 1] > 10 && (yearLoss >= yearStart && yearLoss < yearEnd)) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = 102;
            imgdata[pixelPos + 2] = 153;
            imgdata[pixelPos + 3] = (z < 13) ? (12/z) * 255 : 255;
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    }
  });

  return LossLayer;

});