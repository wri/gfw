/**
 * The Image map layer module.
 *
 * @return ImageLayer class (extends Class).
 */
define([
  'underscore',
  'uri',
  'abstract/layer/OverlayLayerClass',
], function(_, UriTemplate, OverlayLayerClass) {

  'use strict';

  var ImageLayerClass = OverlayLayerClass.extend({

    defaults: {
      dataMaxZoom: 17
    },

    init: function(layer, options, map) {
      this.tiles = {};
      this.layer_slug = layer.slug;
      this._super(layer, options, map);
      if (!!this.options.infowindow) {
        this.addClick();
      }
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this);
      return deferred.promise();
    },

    _getParams: function() {
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
      return params = {
         'color_filter': params.color_filter || 'rgb',
         'cloud':        params.cloud        || '100',
         'mindate':      params.mindate      || '2000-09-01',
         'maxdate':      params.maxdate      || '2015-09-01'
        }
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     coord         Coordenades {x ,y}
     * @param  {integer} zoom          Current map zoom
     * @param  {object}  ownerDocument
     *
     * @return {div}     div           Tile div
     */
    getTile: function(coord, zoom, ownerDocument) {
      var zoomLT7 = (zoom < 7);
      if(zoomLT7) {
        if (this.layer_slug == 'urthe') {return;}
      }
      var zsteps = this._getZoomSteps(zoom);

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom,this._getParams()));

      var image = new Image();
      image.src = url;
      image.className += this.name;
      image.onerror = function() {
        this.style.display = 'none';
      };

      if (zsteps <= 0) {
        return image;
      }

      image.width = 256 * Math.pow(2, zsteps);
      image.height = 256 * Math.pow(2, zsteps);

      var srcX = 256 * (coord.x % Math.pow(2, zsteps));
      var srcY = 256 * (coord.y % Math.pow(2, zsteps));

      image.style.position = 'absolute';
      image.style.top      = -srcY + 'px';
      image.style.left     = -srcX + 'px';

      var div = ownerDocument.createElement('div');
      div.appendChild(image);
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
      div.className += this.name;

      return div;
    },

    _getZoomSteps: function(z) {
      return z - this.options.dataMaxZoom;
    },

    _getUrl: function(x, y, z, params) {
      return new UriTemplate(this.options.urlTemplate).fillFromObject({
        x: x,
        y: y,
        z: z,
        sat: params.color_filter,
        cloud: params.cloud,
        mindate: params.mindate,
        maxdate: params.maxdate
      });
    },

    _getInfoWindowUrl: function(params) {
      return new UriTemplate(this.options.urlInfoWindow).fillFromObject({
        lng: params.lng,
        lat: params.lat,
        cloud: params.cloud,
        mindate: params.mindate,
        maxdate: params.maxdate
      });
    },

    _getTileCoords: function(x, y, z, params) {
      if (z > this.options.dataMaxZoom) {
        x = Math.floor(x / (Math.pow(2, z - this.options.dataMaxZoom)));
        y = Math.floor(y / (Math.pow(2, z - this.options.dataMaxZoom)));
        z = this.options.dataMaxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      return [x, y, z, params];
    }
  });

  return ImageLayerClass;
});
