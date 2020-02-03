/* eslint-disable */
define(['mps', 'moment', 'uri', 'abstract/layer/ImageLayerClass'], function(
  mps,
  moment,
  UriTemplate,
  ImageLayerClass
) {
  'use strict';

  var RecentImageryLayer = ImageLayerClass.extend({
    options: {
      dataMaxZoom: 14
    },

    init: function(layer, options, map) {
      this._super(layer, options, map);
      this.currentDate = [
        !!options.currentDate && !!options.currentDate[0]
          ? moment.utc(options.currentDate[0])
          : moment.utc().subtract(4, 'month'),
        !!options.currentDate && !!options.currentDate[1]
          ? moment.utc(options.currentDate[1])
          : moment.utc()
      ];
    },

    _getParams: function() {
      var params = {};
      if (
        window.location.search.contains('recentImagery=') &&
        window.location.search.indexOf(
          '=',
          window.location.search.indexOf('recentImagery=') + 11
        ) !== -1
      ) {
        var params_new_url = {};
        var parts = location.search.substring(1).split('&');
        for (var i = 0; i < parts.length; i++) {
          var nv = parts[i].split('=');
          if (!nv[0]) continue;
          params_new_url[nv[0]] = nv[1] || true;
        }
        params = JSON.parse(atob(params_new_url.recentImagery));
      }

      return params;
    },

    _getUrl: function(x, y, z, params) {
      if (params.urlTemplate) {
        return new UriTemplate(params.urlTemplate).fillFromObject({
          x: x,
          y: y,
          z: z
        });
      }
      return null;
    },

    setCurrentDate: function(date) {
      this.currentDate = date;
    }
  });

  return RecentImageryLayer;
});
