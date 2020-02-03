/**
 * The Image map layer module.
 *
 * @return ImageLayer class (extends Class).
 */
define([
  'underscore',
  'uri',
  'mps',
  'abstract/layer/OverlayLayerClass',
], function(_, mps, UriTemplate, OverlayLayerClass) {

  'use strict';

  var ImageMaptypeLayerClass = OverlayLayerClass.extend({

    defaults: {
      urlTemplate: ''
    },

    init: function(layer, options, map) {
      _.bindAll(this, '_getUrl');
      this._super(layer, options, map);
      this._setImageMaptype();
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this._imageMaptype);
      mps.publish('Map/loading', [false]);
      return deferred.promise();
    },

    /**
     * Generates the google.maps.ImageMapType layer.
     */
    _setImageMaptype: function() {
      this._imageMaptype = new google.maps.ImageMapType({
        tileSize: this.tileSize,
        opacity: 1,
        isPng: true,
        name: this.name,
        getTileUrl: this._getUrl
      });
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     tile Tile coordenades {x ,y}
     * @param  {integer} zoom Current map zoom
     * @return {string}  url  Tile url
     */
    _getUrl: function(tile, zoom) {
      var params = {};
      if (window.location.search.contains('&hresolution=') && window.location.search.indexOf('=', window.location.search.indexOf('&hresolution=') + 13) !== -1) {
        var params_new_url = {};
        var parts = location.search.substring(1).split('&');
        for (var i = 0; i < parts.length; i++) {
          var nv = parts[i].split('=');
          if (!nv[0]) continue;
            params_new_url[nv[0]] = nv[1] || true;
        }
        params = JSON.parse(atob(params_new_url.hresolution));
      }
      else if (!!sessionStorage.getItem('high-resolution')) {
        params = JSON.parse(atob(sessionStorage.getItem('high-resolution')));
      }
      params = {
         'color_filter': params.color_filter || 'rgb',
         'cloud': params.cloud || '100',
         'mindate': params.mindate || '2000-09-01',
         'maxdate': params.maxdate || '2015-09-01'
        }
      return new UriTemplate(this.options.urlTemplate).fillFromObject({
        x: tile.x,
        y: tile.y,
        z: zoom,
        sat: params.color_filter,
        cloud: params.cloud,
        mindate: params.mindate,
        maxdate: params.maxdate
      });
    }
  });

  return ImageMaptypeLayerClass;
});
