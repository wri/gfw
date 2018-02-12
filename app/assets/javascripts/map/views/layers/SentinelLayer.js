/**
 * The Urthecast layer module for use on canvas.
 *
 * @return UrthecastLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
  'uri',
  'moment',
  'map/views/layers/CustomInfowindow',

], function(ImageLayerClass, UriTemplate, moment, CustomInfowindow) {

  'use strict';

  var API_URL = window.gfw.config.GFW_API_HOST_NEW_API;

  var UrthecastLayer = ImageLayerClass.extend({
    options: {
      urlTemplate: API_URL + '/urthecast/map-tiles{/sat}{/z}{/x}{/y}?cloud_coverage_lte={cloud}&acquired_gte={mindate}&acquired_lte={maxdate}T23:59:59Z&sensor_platform={sensor_platform}',
      urlInfoWindow: API_URL + '/urthecast/archive/scenes/?geometry_intersects=POINT({lng}+{lat})&cloud_coverage_lte={cloud}&tiled_lte={tileddate}&acquired_gte={mindate}&acquired_lte={maxdate}&sort=-acquired&sensor_platform={sensor_platform}',
      urlBounds: API_URL + '/urthecast/archive/scenes/?cloud_coverage_lte={cloud}&tiled_lte={tileddate}&acquired_gte={mindate}&acquired_lte={maxdate}&geometry_intersects={geo}&sort=-acquired&sensor_platform={sensor_platform}',
      dataMaxZoom: {
        'rgb': 14,
        'ndvi': 13,
        'evi': 13,
        'ndwi': 13,
        'false-color-nir' : 13
      },
      infowindowImagelayer: true
    },

    init: function(layer, options, map) {
      this._super(layer, options, map);
      this.addEvents();
    },

    _getParams: function() {
      var params = {};
      if (window.location.search.contains('hresolution=') && window.location.search.indexOf('=', window.location.search.indexOf('hresolution=') + 11) !== -1) {
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
         'cloud':        params.cloud        || '100',
         'mindate':      params.mindate      || '2000-09-01',
         'maxdate':      params.maxdate      || '2015-09-01',
         'sensor_platform' : params.sensor_platform || 'theia,landsat-8,deimos-1,sentinel-2a'
        }
      return params;
    },

    _getUrl: function(x, y, z, params) {
      return new UriTemplate(this.options.urlTemplate).fillFromObject({
        x: x,
        y: y,
        z: z,
        sat: params.color_filter,
        cloud: params.cloud,
        mindate: params.mindate,
        maxdate: params.maxdate,
        sensor_platform: params.sensor_platform
      });
    },

    _getInfoWindowUrl: function(params) {
      return new UriTemplate(this.options.urlInfoWindow).fillFromObject({
        lng: params.lng,
        lat: params.lat,
        cloud: params.cloud,
        mindate: moment(params.mindate).format("YYYY-MM-DD"),
        maxdate: moment(params.maxdate).format("YYYY-MM-DD"),
        tileddate: params.tileddate,
        sensor_platform: params.sensor_platform
      });
    },

    _getBoundsUrl: function(params) {
      return new UriTemplate(this.options.urlBounds).fillFromObject({
        geo: params.geo,
        cloud: params.cloud,
        mindate: moment(params.mindate).format("YYYY-MM-DD"),
        maxdate: moment(params.maxdate).format("YYYY-MM-DD"),
        tileddate: params.tileddate,
        sensor_platform: params.sensor_platform
      });
    },


    // TILES
    getTile: function(coord, zoom, ownerDocument) {

      if(zoom < 5) {
        return;
      }
      var zsteps = this._getZoomSteps(zoom);
      var srcX = 256 * (coord.x % Math.pow(2, zsteps));
      var srcY = 256 * (coord.y % Math.pow(2, zsteps));
      var widthandheight = (zsteps > 0) ? 256 * Math.pow(2, zsteps) + 'px' : this.tileSize.width + 'px';

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom,this._getParams()));

      // Image to render
      var image = new Image();
      image.src = url;
      image.className += this.name;
      image.style.position = 'absolute';
      image.style.top      = -srcY + 'px';
      image.style.left     = -srcX + 'px';
      image.style.width = '100%';
      image.style.height = '100%';

      // Loader
      var loader = ownerDocument.createElement('div');
      loader.className += 'loader spinner start';
      loader.style.position = 'absolute';
      loader.style.top      = '50%';
      loader.style.left     = '50%';
      loader.style.border = '4px solid #FFF';
      loader.style.borderRadius = '50%';
      loader.style.borderTopColor = '#555';

      // Wwrap the loader and the image
      var div = ownerDocument.createElement('div');
      div.appendChild(image);
      div.appendChild(loader);
      div.style.width = widthandheight;
      div.style.height = widthandheight;
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
      div.className += this.name;

      image.onload = function() {
        div.removeChild(loader);
      };

      image.onerror = function() {
        div.removeChild(loader)
        this.style.display = 'none';
      };

      return div;
    },

    _getTileCoords: function(x, y, z, params) {
      var maxZoom = this.options.dataMaxZoom[params['color_filter']];
      if (z > maxZoom) {
        x = Math.floor(x / (Math.pow(2, z - maxZoom)));
        y = Math.floor(y / (Math.pow(2, z - maxZoom)));
        z = maxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      return [x, y, z, params];
    },


    // INFOWINDOW
    setInfoWindow: function (_data, event) {
      var data = _data;
      if (!!data) {
        var infoWindowOptions = {
          offset: [0, 100],
          infowindowData: {
            acquired: moment(data['acquired']).format("MMMM Do, YYYY"),
            platform: data['platform'].toUpperCase(),
            sensor_platform: data['sensorPlatform'].toUpperCase(),
            cloud_coverage: (data['cloudCoverage']) ? Math.ceil( data['cloudCoverage'] * 10) / 10 : '0'
          }
        }
        this.infowindow = new CustomInfowindow(event.latLng, this.map, infoWindowOptions);
        this.removeMultipolygon();
        this.drawMultipolygon(data.geometry);
      }
    },

    removeInfoWindow: function() {
      if(this.infowindow) {
        this.infowindow.remove();
      }
    },



    // MAP EVENTS
    addEvents: function() {
      this.clickevent = google.maps.event.addListener(this.map, "click", this.onClickEvent.bind(this));
      this.dragendevent = google.maps.event.addListener(this.map, "dragend", this.checkForImagesInBounds.bind(this));
      this.zoomChangedEvent = google.maps.event.addListener(this.map, "zoom_changed",  this.checkForImagesInBounds.bind(this));
    },

    clearEvents: function() {
      google.maps.event.clearListeners(this.map, this.clickevent);
      google.maps.event.clearListeners(this.map, this.dragendevent);
      google.maps.event.clearListeners(this.map, this.zoomChangedEvent);
    },

    checkForImagesInBounds: function() {
      // // Set Date
      var today = moment();
      var tomorrow = today.add('days', 1);
      var geo = this.getBoundsPolygon();

      if (!!geo) {
        // Set options to get the url of the api
        var options = _.extend({}, this._getParams(), {
          geo: geo,
          tileddate: moment(tomorrow).format("YYYY-MM-DD"),
        });
        var url = this._getBoundsUrl(options);
        $.get(url).done(_.bind(function(response) {
          this.hidenotification();
          if (!!response && !!response.data && !response.data.length) {
            this.notificate('notification-no-images-urthecast');
          }
        }, this ));
      }
    },

    onClickEvent: function(event) {
      // Set Date
      var today = moment();
      var tomorrow = today.add('days', 1);

      // Set options to get the url of the api
      var options = _.extend({}, this._getParams(), {
        lng: event.latLng.lng(),
        lat: event.latLng.lat(),
        tileddate: moment(tomorrow).format("YYYY-MM-DD"),
      });
      var url = this._getInfoWindowUrl(options);

      $.get(url).done(_.bind(function(response) {
        this.removeInfoWindow();
        if (!!response && !!response.data && !!response.data.length) {
          this.setInfoWindow(response.data[0].attributes, event);
        }
      }, this ));
    },



    // HELPERS
    setStyle: function() {
      this.map.data.setStyle(function(feature){
        return ({
          editable: false,
          strokeWeight: 2,
          fillOpacity: 0,
          fillColor: '#FFF',
          strokeColor: '#FF6633'
        });
      });
    },

    drawMultipolygon: function(geom) {
      var multipolygon_todraw = {
        type: "Feature",
        geometry: geom
      }

      this.multipolygon = this.map.data.addGeoJson(multipolygon_todraw)[0];
      if (this.listener) {
        google.maps.event.removeListener(this.listener, 'click');
      }
      this.listener = this.map.data.addListener("click", function(e){
        google.maps.event.trigger(this.map, 'click', e);
      }.bind(this));
      this.setStyle();
    },

    getBoundsPolygon: function() {
      var bounds = this.map.getBounds();
      if (!!bounds) {
        var nlat = bounds.getNorthEast().lat(),
            nlng = bounds.getNorthEast().lng(),
            slat = bounds.getSouthWest().lat(),
            slng = bounds.getSouthWest().lng();

        // Define the LngLat coordinates for the polygon.
        var boundsJson = {
          "type": "Polygon",
          "coordinates":[[
            [slng,nlat],
            [nlng,nlat],
            [nlng,slat],
            [slng,slat],
            [slng,nlat]
          ]]
        }
        return JSON.stringify(boundsJson);
      }
      return null;
    },

    _getZoomSteps: function(z) {
      var params = this._getParams();
      return z - this.options.dataMaxZoom[params['color_filter']];
    },

  });

  return UrthecastLayer;

});
