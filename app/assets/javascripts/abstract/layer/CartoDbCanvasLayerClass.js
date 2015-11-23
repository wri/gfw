define([
  'abstract/layer/CanvasLayerClass',
  'map/services/CartoDbLayerService'
], function(CanvasLayerClass, CartoDbLayerService) {

  'use strict';

  var CartoDbCanvasLayerClass = CanvasLayerClass.extend({
    init: function(layer, options, map) {
      options = options || {};

      this.currentDate = options.currentDate ||
        [moment(layer.mindate || undefined), moment()];

      this._super(layer, options, map);
    },

    _getLayer: function() {
      var deferred = new $.Deferred();

      var config = {
        version: "1.2.0",
        layers: [{
          type: "cartodb",
          options: {
            sql: this._getSQL(),
            cartocss: this._getCartoCSS(),
            cartocss_version: "2.3.0"
          }
        }]
      };

      var url = 'http://wri-01.cartodb.com/api/v1/map?stat_tag=API';
      var context = this;
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(config),
        contentType:"application/json; charset=utf-8",
        dataType: 'json'
      }).then(function(config) {
        context.options.urlTemplate = 'https://' + config.cdn_url.https + '/wri-01/api/v1/map/' + config.layergroupid + '{/z}{/x}{/y}.png32';
        deferred.resolve(context);
      });

      return deferred.promise();
    },

    _getCartoCSS: function() {
      var cssRules = ["#layer { marker-width: 1; marker-line-width: 0; marker-allow-overlap: true;"];

      var startDate = moment('2015-01-01'),
          endDate = moment();

      var currDate = startDate.clone().startOf('day');
      while(currDate.diff(endDate) < 0) {
        var formattedDate = currDate.format('YYYY-MM-DD'),
            dayOfYear = currDate.dayOfYear();

        var rgb;
        if (dayOfYear > 255) {
          rgb = "0," + (dayOfYear % 255) + ", 0, 1";
        } else {
          rgb = dayOfYear + ", 0, 0, 1";
        }

        cssRules.push("[date=\"" + formattedDate + "\"] { marker-fill: rgba(" + rgb + "); }");
        currDate = currDate.add('days', 1);
      }

      console.log( cssRules.join(" ") + "}");
      return cssRules.join(" ") + "}";
    },

    _getSQL: function() {
      return "SELECT cartodb_id, the_geom, the_geom_webmercator, to_char(date, 'YYYY-MM-DD') AS date FROM umd_alerts_agg";
    },

    filterCanvasImgdata: function() {
      throw('filterCanvasImgdata must be implemented');
    }

  });

  return CartoDbCanvasLayerClass;

});
