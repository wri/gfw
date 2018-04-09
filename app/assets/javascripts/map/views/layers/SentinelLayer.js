/**
 * The Sentinel layer module for use on canvas.
 *
 * @return SentinelLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
  'uri',
  'moment',
  'map/views/layers/CustomInfowindow',

], function(ImageLayerClass, UriTemplate, moment, CustomInfowindow) {

  'use strict';

  var SENTINEL_URL = 'https://services.sentinel-hub.com/v1/{provider}/9f85dfae-bf90-4638-81d3-dc9925dd5b26/';
  var LANDSAT_URL = 'https://services-uswest2.sentinel-hub.com/v1/{provider}/0e8c6cde-ff77-4e38-aba8-33b171896972/';
  var TILE_SIZE = 256;
  var MAX_ZOOM = 9;

  var TILES_PARAMS = '?SERVICE=WMS&REQUEST=GetMap&LAYERS=TRUE_COLOR&BBOX={bbox}&MAXCC={cloud}&CLOUDCORRECTION=none&WIDTH=512&HEIGHT=512&FORMAT=image/png&TIME={mindate}/{maxdate}&CRS=CRS:84&TRANSPARENT=TRUE&PRIORITY=mostRecent';

  var METADATA_PARAMS = '?service=WFS&version=2.0.0&request=GetFeature&time={mindate}/{maxdate}&typenames=TILE&maxfeatures=1&srsname=CRS:84&LAYERS=TRUE_COLOR&MAXCC={cloud}&CLOUDCORRECTION=none&&bbox={bbox}&PRIORITY=mostRecent&outputformat=application/json';

  var SentinelLayer = ImageLayerClass.extend({
    options: {
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

      return {
        'color_filter': params.color_filter || 'rgb',
        'cloud':        params.cloud        || '100',
        'mindate':      params.mindate      || '2000-09-01',
        'maxdate':      params.maxdate      || '2015-09-01',
        'sensor_platform' : params.sensor_platform || 'landsat-8'
      }
    },

    calcBboxFromXY: function(x, y, z) {
      var proj = this.map.getProjection();
      var tileSize = TILE_SIZE / Math.pow(2,z);
      var tileBounds = new google.maps.LatLngBounds(
        proj.fromPointToLatLng(new google.maps.Point(x*tileSize, (y+1)*tileSize)),
        proj.fromPointToLatLng(new google.maps.Point((x+1)*tileSize, y*tileSize))
      );
      var parsedB = tileBounds.toJSON();
      return [parsedB.west, parsedB.north, parsedB.east, parsedB.south].join(',');
    },


    _getUrlTemplateBySensor: function(sensor) {
      this.sensor = sensor;
      return sensor === 'sentinel-2' ? SENTINEL_URL
        : LANDSAT_URL;
    },

    _getUrl: function(x, y, z, params) {
      var urlTemplate = this._getUrlTemplateBySensor(params.sensor_platform) + TILES_PARAMS;
      var urlParams = {
        sat: params.color_filter,
        cloud: params.cloud,
        mindate: params.mindate,
        maxdate: params.maxdate,
        bbox: this.calcBboxFromXY(x, y, z),
        provider: 'wms'
      };

      return new UriTemplate(urlTemplate).fillFromObject(urlParams);
    },

    _getInfoWindowUrl: function(params) {
      var urlTemplate = this._getUrlTemplateBySensor(params.sensor_platform) + METADATA_PARAMS;
      return new UriTemplate(urlTemplate).fillFromObject({
        mindate: params.mindate,
        maxdate: params.maxdate,
        bbox: params.bbox,
        cloud: params.cloud,
        provider: 'wfs'
      });
    },

    _getBoundsUrl: function(params) {
      this.clear();

      var urlTemplate = this._getUrlTemplateBySensor(params.sensor_platform);
      return new UriTemplate(this.options[urlTemplate]).fillFromObject({
        geo: params.geo,
        cloud: params.cloud,
        mindate: moment(params.mindate).format("YYYY-MM-DD"),
        maxdate: moment(params.maxdate).format("YYYY-MM-DD"),
        tileddate: params.tileddate,
        sensor_platform: params.sensor_platform,
        provider: 'wms'
      });
    },


    // TILES
    getTile: function(coord, zoom, ownerDocument) {
      if(zoom < MAX_ZOOM) {
        return ownerDocument.createElement('div');
      }

      var zsteps = this._getZoomSteps(zoom);
      var srcX = TILE_SIZE * (coord.x % Math.pow(2, zsteps));
      var srcY = TILE_SIZE * (coord.y % Math.pow(2, zsteps));
      var widthandheight = (zsteps > 0) ? TILE_SIZE * Math.pow(2, zsteps) + 'px' : this.tileSize.width + 'px';

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
            acquired: moment.utc(data['date'], 'YYYY-MM-DD').format("MMMM Do, YYYY"),
            sensor_platform: this.sensor,
            cloud_coverage: (data['cloudCoverPercentage']) ? Math.ceil( data['cloudCoverPercentage'] * 10) / 10 : '0'
          }
        }
        this.infowindow = new CustomInfowindow(event.latLng, this.map, infoWindowOptions);
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
    },

    clearEvents: function() {
      google.maps.event.removeListener(this.clickevent);
    },

    onClickEvent: function(event) {
      if(this.map.getZoom() >= MAX_ZOOM) {
        // Set options to get the url of the api
        var bounds = this.getBoundsFromLatLng(event.latLng);
        var options = _.extend({}, this._getParams(), {
          lng: event.latLng.lng(),
          lat: event.latLng.lat(),
          bbox: bounds
        });
        var url = this._getInfoWindowUrl(options);

        $.get(url)
          .done(function(data) {
            this.clear();

            var feature = data.features[0];

            if (feature) {
              this.drawMultipolygon(feature.geometry);
              this.setInfoWindow(feature.properties, event);
            }
          }.bind(this));
      }
    },

    getBoundsFromLatLng: function(latLng) {
      var offsetX = TILE_SIZE;
      var offsetY = TILE_SIZE;

      var tileSize = TILE_SIZE / Math.pow(2, this.map.getZoom());

      var point1 = this.map.getProjection().fromLatLngToPoint(latLng);
      var point2 = new google.maps.Point(offsetX / Math.pow(2, this.map.getZoom()),
        offsetY / Math.pow(2, this.map.getZoom())
      );
      var newLat = this.map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x + (tileSize / 2),
        point1.y + (tileSize / 2)
      ));

      return latLng.lng() + ',' + latLng.lat() + ',' + newLat.lng() + ',' + newLat.lat();
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

    clear: function() {
      this.removeMultipolygon();
      this.removeInfoWindow();
    },

    removeLayer: function() {
      this.clear();
      this.clearEvents();
    }
  });

  return SentinelLayer;

});
