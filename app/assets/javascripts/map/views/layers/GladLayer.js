define([
  'bluebird', 'uri',
  'abstract/layer/AnimatedCanvasLayerClass',
  'map/presenters/TorqueLayerPresenter'
], function(
  Promise, UriTemplate,
  AnimatedCanvasLayerClass,
  Presenter
) {

  'use strict';

  var TILE_URL = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/band1_day/ImageServer/tile{/z}{/y}{/x}';

  var GladLayer = AnimatedCanvasLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this._setupAnimation();

      this.currentDate = [
        moment('2015-01-01'),
        moment()
      ];

      this.maxDate = moment();
    },

    _getLayer: function() {
      return Promise.resolve(this);
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(TILE_URL).fillFromObject({x: x, y: y, z: z});
    },

    decodeDate: function(r, g, b) {
      var dayOfYear = r + g,
          year = parseInt(b.toString().slice(1), 10) + 2000;

      return [dayOfYear, year];
    },

    decodeConfidence(r, g, b) {
      return parseInt(b.toString()[0], 10) - 1;
    },

    filterCanvasImgdata: function(imgdata, w, h) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment(this.currentDate[0]),
          moment(this.currentDate[1])];
      }

      var startYear = this.timelineExtent[0].year(),
          endYear = this.timelineExtent[1].year();
      var startDay = this.timelineExtent[0].dayOfYear() + ((startYear - 2015) * 365),
          endDay = this.timelineExtent[1].dayOfYear() + ((endYear - 2015) * 365);

      var recentRangeStart = this.maxDate.clone().subtract(7, 'days'),
          recentRangeStartYear = recentRangeStart.year();
      var recentRangeEnd = this.maxDate.clone(),
          recentRangeEndYear = recentRangeEnd.year();
      var recentRangeStartDay = recentRangeStart.dayOfYear() + ((recentRangeStartYear - 2015) * 365),
          recentRangeEndDay = recentRangeEnd.dayOfYear() + ((recentRangeEndYear - 2015) * 365);

      var pixelComponents = 4; // RGBA
      var pixelPos, i, j;
      for(i = 0; i < w; ++i) {
        for(j = 0; j < h; ++j) {
          pixelPos = (j * w + i) * pixelComponents;
          var date = this.decodeDate(imgdata[pixelPos],
            imgdata[pixelPos+1], imgdata[pixelPos+2]);
          var year = date[1],
              day = date[0] + ((year - 2015) * 365);

          var confidence = this.decodeConfidence(imgdata[pixelPos],
            imgdata[pixelPos+1], imgdata[pixelPos+2]);

          if (day >= startDay && day <= endDay && confidence === 1) {
            if (day >= recentRangeStartDay && day <= recentRangeEndDay) {
              imgdata[pixelPos] = 219;
              imgdata[pixelPos + 1] = 168;
              imgdata[pixelPos + 2] = 0;
            } else {
              imgdata[pixelPos] = 220;
              imgdata[pixelPos + 1] = 102;
              imgdata[pixelPos + 2] = 153;
            }
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      }
    }
  });

  return GladLayer;

});
