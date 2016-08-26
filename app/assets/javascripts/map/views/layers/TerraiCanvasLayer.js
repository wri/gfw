define([
  'bluebird', 'uri', 'd3', 'mps', 'moment',
  'abstract/layer/AnimatedCanvasLayerClass',
  'map/services/TerraiDateService',
  'map/presenters/GladLayerPresenter'
], function(
  Promise, UriTemplate, d3, mps, moment,
  AnimatedCanvasLayerClass,
  TerraiDateService,
  Presenter
) {

  'use strict';

  var TILE_URL = 'http://wri-tiles.s3.amazonaws.com/terrai_prod/tiles/{z}/{x}/{y}.png';
  var START_DATE = '2004-01-01';
  var START_YEAR = '2004';

  var padNumber = function(number) {
    var s = "00" + number;
    return s.substr(s.length - 3);
  };

  var TerraiCanvasLayer = AnimatedCanvasLayerClass.extend({

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.presenter.setConfirmedStatus(options.layerOptions);
      this.options.showLoadingSpinner = true;
      this.options.dataMaxZoom = 12;
      this._setupAnimation();

      this.currentDate = [
        (!!options.currentDate && !!options.currentDate[0]) ?
          moment.utc(options.currentDate[0]) : moment.utc(START_DATE),
        (!!options.currentDate && !!options.currentDate[1]) ?
          moment.utc(options.currentDate[1]) : moment.utc(),
      ];

      this.maxDate = this.currentDate[1];
    },

    _getLayer: function() {
      return new Promise(function(resolve) {

      var dateService = new TerraiDateService();

      dateService.fetchDates().then(function(response) {
        // Check max date
        this._checkMaxDate(response);
        mps.publish('Torque/date-range-change', [this.currentDate]);
        mps.publish('Place/update', [{go: false}]);

        resolve(this);
      }.bind(this));

      }.bind(this));
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(TILE_URL).fillFromObject({x: x, y: y, z: z});
    },

    _checkMaxDate: function(response) {
      var maxDataDate = moment.utc(response.maxDate);
      if (this.maxDate.isAfter(maxDataDate)) {
        this.maxDate = maxDataDate;
        this.currentDate[1] = this.maxDate;
      }
    },

    filterCanvasImgdata: function(imgdata, w, h, z) {
      var components = 4;
      var start = (this.currentDate[0].year() - START_YEAR) * 23 +
        Math.ceil((this.currentDate[0].dayOfYear() - 1) / 16);
      var end = (this.currentDate[1].year()- START_YEAR) * 23 +
        Math.floor((this.currentDate[1].dayOfYear() - 1) / 16);

      if (start < 1) {
        start = 1;
      }

      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment.utc(this.currentDate[0]),
          moment.utc(this.currentDate[1])];
      }

      // console.log(this.currentDate);
      //
      // console.log(start, end);

      for(var i=0; i < w; ++i) {
        for(var j=0; j < h; ++j) {
          var pixelPos = (j*w + i) * components;

          var r = imgdata[pixelPos];
          var g = imgdata[pixelPos+1];
          var b = imgdata[pixelPos+2];
          var intensity = Math.min(b * 4, 255);

          var timeLoss = r + g;

          if (timeLoss >= start && timeLoss <= end) {
            imgdata[pixelPos]     = 220;
            imgdata[pixelPos + 1] = 102;
            imgdata[pixelPos + 2] = 153;
            imgdata[pixelPos + 3] = intensity;

            if (timeLoss > this.top_date) {
              imgdata[pixelPos]     = 233;
              imgdata[pixelPos + 1] = 189;
              imgdata[pixelPos + 2] = 21;
              imgdata[pixelPos + 3] = intensity;
            }
          } else {
            imgdata[pixelPos + 3] = 0;
          }
        }
      } //end first for loop
    }
  });

  return TerraiCanvasLayer;

});
