define([
  'moment', 'd3', 'handlebars', 'uri',
  'helpers/canvasCartoCSSHelper',
  'abstract/layer/CartoDbCanvasLayerClass',
  'map/presenters/TorqueLayerPresenter',
  'map/services/CartoDbLayerDateService', 'map/services/CartoDbLayerService', 'map/services/CartoDbRasterLayerService',
  'text!map/queries/as_it_happens_hybrid.sql.hbs', 'text!map/queries/as_it_happens_hybrid_raster.sql.hbs',
  'text!map/cartocss/as_it_happens_hybrid_raster.cartocss',
], function(
  moment, d3, Handlebars, UriTemplate,
  canvasCartoCSSHelper,
  CartoDbCanvasLayerClass,
  Presenter,
  CartoDbLayerDateService, CartoDbLayerService, CartoDbRasterLayerService,
  SQL, rasterSQL,
  rasterCartoCSS) {

  'use strict';

  var AsItHappensHybridLayer = CartoDbCanvasLayerClass.extend({

    table: 'umd_alerts_agg_hybrid',

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
    },

    _getUrl: function(x, y, z) {
      var url;
      if (z > 9) {
        url = this.options.rasterUrlTemplate;
      } else {
        url = this.options.pointsUrlTemplate;
      }

      return new UriTemplate(url).fillFromObject({x: x, y: y, z: z});
    },

    _getLayer: function() {
      return new Promise(function(resolve) {

      var dateConfigService = new CartoDbLayerDateService({
        dateAttribute: 'date',
        table: 'ov_9_umd_alerts_agg_hybrid' });

      var context = this;
      dateConfigService.fetchLayerConfig().then(function(dates) {
        context.maxDate = moment(dates.max_date);
        if (context.currentDate[1] === undefined) {
          context.currentDate[1] = context.maxDate;
        }

        return Promise.all([
          context.getPointsLayerConfig(),
          context.getRasterLayerConfig()
        ]);
      }).then(function(layerConfig) {
        var pointsConfig = layerConfig[0],
            rasterConfig = layerConfig[1];

        context.options.rasterUrlTemplate = 'https://' + rasterConfig.cdn_url.https + '/wri-01/api/v1/map/' + rasterConfig.layergroupid + '{/z}{/x}{/y}.png32';
        context.options.pointsUrlTemplate = 'https://' + pointsConfig.cdn_url.https + '/wri-01/api/v1/map/' + pointsConfig.layergroupid + '{/z}{/x}{/y}.png32';
        context._setupAnimation();

        resolve(context);
      });

      }.bind(this));
    },

    getPointsLayerConfig: function() {
      var startDate = moment('2015-01-01'),
          endDate = moment(),
          cartoCSS = canvasCartoCSSHelper.generateDaily('date', startDate, endDate);

      var sqlTemplate = Handlebars.compile(SQL),
          sql = sqlTemplate({table: this.table});

      var pointsConfigService = new CartoDbLayerService(sql, cartoCSS);
      return pointsConfigService.fetchLayerConfig();
    },

    getRasterLayerConfig: function() {
      var rasterConfigService = new CartoDbRasterLayerService(
        rasterSQL, rasterCartoCSS);
      return rasterConfigService.fetchLayerConfig();
    },

    /*
     * Takes an array of RGBA values for a map tile.
     *
     * Assuming that the day of the year is encoded in the R and G
     * channels, this method hides any pixels whose day of the year is
     * not within the current range selected by the user/timeline.
     *
     */
    filterCanvasImgdata: function(imgdata, w, h, z) {
      if (this.timelineExtent === undefined) {
        this.timelineExtent = [moment(this.currentDate[0]),
          moment(this.currentDate[1])];
      }

      var startDay = this.timelineExtent[0].dayOfYear(),
          startYear = this.timelineExtent[0].year();
      var endYear = this.timelineExtent[1].year(),
          endDay = this.timelineExtent[1].dayOfYear() + ((endYear - 2015) * 365);

      var recentRangeStart = this.maxDate.clone().subtract(7, 'days'),
          recentRangeStartDay = recentRangeStart.dayOfYear(),
          recentRangeStartYear = recentRangeStart.year();
      var recentRangeEnd = this.maxDate.clone(),
          recentRangeEndYear = recentRangeEnd.year(),
          recentRangeEndDay = recentRangeEnd.dayOfYear() + ((recentRangeEndYear - 2015) * 365);

      var pixelComponents = 4; // RGBA

      for(var i = 0; i < w; ++i) {
        for(var j = 0; j < h; ++j) {
          var pixelPos = (j * w + i) * pixelComponents;
          var yearOfLoss, dayOfLoss;
          if (z > 8) {
            if (imgdata[pixelPos] > 0) {
              if (imgdata[pixelPos+1] === 0) {
                yearOfLoss = 2015;
                dayOfLoss  = imgdata[pixelPos];
              } else {
                yearOfLoss = 2016;
                dayOfLoss  = imgdata[pixelPos] + 144;
              }
            } else {
              if (imgdata[pixelPos+1] <= 110) {
                yearOfLoss = 2015;
                dayOfLoss  = imgdata[pixelPos+1] + 255;
              } else {
                yearOfLoss = 2016;
                dayOfLoss  = imgdata[pixelPos+1] - 110;
              }
            }
          } else {
            // The B channel represents the year than an alert occurred
            var yearOfLoss = 2016;
            if (imgdata[pixelPos+2] === 0) {
              yearOfLoss = 2015;
            }

            // The R channel represents the day of the year that an alert
            // occurred, where `day <= 255`
            var dayOfLoss = imgdata[pixelPos];
            if (dayOfLoss === 0 && imgdata[pixelPos+1] !== 0) {
              // The G channel represents the day of year that an alert
              // occurred, where `day > 255`
              dayOfLoss = imgdata[pixelPos+1] + 255;
            }
          }

          if (yearOfLoss > startYear) {
            dayOfLoss = dayOfLoss + ((yearOfLoss - 2015) * 365);
          }

          if (dayOfLoss >= startDay && yearOfLoss >= startYear && dayOfLoss <= endDay && yearOfLoss <= endYear) {
            if (dayOfLoss >= recentRangeStartDay && yearOfLoss >= recentRangeStartYear && dayOfLoss <= recentRangeEndDay && yearOfLoss <= recentRangeEndYear) {
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

  return AsItHappensHybridLayer;

});
