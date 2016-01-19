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

  var UrthecastLayer = ImageLayerClass.extend({
    options: {
      urlTemplate:'http://uc.gfw-apis.appspot.com/urthecast/map-tiles{/sat}{/z}{/x}{/y}?cloud_coverage_lte={cloud}&acquired_gte={mindate}&acquired_lte={maxdate}T23:59:z00Z',
      urlInfoWindow: 'http://uc.gfw-apis.appspot.com/urthecast/archive/scenes/?geometry_intersects=POINT({lng}+{lat})&cloud_coverage_lte={cloud}&tiled_lte={tileddate}&acquired_gte={mindate}&acquired_lte={maxdate}&sort=-acquired',
      urlBounds: 'http://uc.gfw-apis.appspot.com/urthecast/archive/scenes/?cloud_coverage_lte={cloud}&tiled_lte={tileddate}&acquired_gte={mindate}&acquired_lte={maxdate}&geometry_intersects={geo}&sort=-acquired',
      dataMaxZoom: 13,
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
         'maxdate':      params.maxdate      || '2015-09-01'
        }
      return params;
    },

    _getInfoWindowUrl: function(params) {
      return new UriTemplate(this.options.urlInfoWindow).fillFromObject({
        lng: params.lng,
        lat: params.lat,
        cloud: params.cloud,
        mindate: moment(params.mindate).format("YYYY-MM-DD"),
        maxdate: moment(params.maxdate).format("YYYY-MM-DD"),
        tileddate: params.tileddate
      });
    },

    _getBoundsUrl: function(params) {
      return new UriTemplate(this.options.urlBounds).fillFromObject({
        geo: params.geo,
        cloud: params.cloud,
        mindate: moment(params.mindate).format("YYYY-MM-DD"),
        maxdate: moment(params.maxdate).format("YYYY-MM-DD"),
        tileddate: params.tileddate
      });
    },

    addEvents: function() {
      this.onDragEnd();
      this.idleevent = google.maps.event.addListener(this.map, "idle", _.bind(this.onDragEnd, this ));
      this.clickevent = google.maps.event.addListener(this.map, "click", _.bind(this.onClickEvent, this ));
      this.dragendevent = google.maps.event.addListener(this.map, "dragend", _.bind(this.onDragEnd, this ));
    },

    clearEvents: function() {
      google.maps.event.clearListeners(this.map, 'dragend')
    },

    setInfoWindow: function (_data, event) {
      var data = _data;
      if (!!data) {
        var infoWindowOptions = {
          offset: [0, 100],
          infowindowData: {
            acquired: moment(data['acquired']).format("MMMM Do, YYYY"),
            platform: data['platform'].toUpperCase(),
            sensor_platform: data['sensor_platform'].toUpperCase(),
            cloud_coverage: (data['cloud_coverage']) ? Math.ceil( data['cloud_coverage'] * 10) / 10 : '0'
          }
        }
        this.infowindow = new CustomInfowindow(event.latLng, this.map, infoWindowOptions);
        this.removeMultipolygon();
        this.drawMultipolygon(data.geometry);
      }
    },

    /**
     * Set geojson style.
     */
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

    setStyle: function() {
      this.map.data.setStyle(_.bind(function(feature){
        var strokeColor = (feature.getProperty('color')) ? feature.getProperty('color') : '#A2BC28';
        return ({
          strokeWeight: 2,
          fillOpacity: 0,
          fillColor: '#FFF',
          strokeColor: strokeColor
        });
      }, this ));
    },


    // Events
    onDragEnd: function() {
      // // Set Date
      var today = moment();
      var tomorrow = today.add('days', 1);

      // // Set options to get the url of the api
      var options = _.extend({}, this._getParams(), {
        geo: this.getBoundsPolygon(),
        tileddate: moment(tomorrow).format("YYYY-MM-DD"),
      });
      var url = this._getBoundsUrl(options);
      this.hidenotification();
      $.get(url).done(_.bind(function(data) {
        if (!!data && !!data.payload && !data.payload.length) {
          this.notificate('not-no-images-urthecast');
        }
      }, this ));
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

      $.get(url).done(_.bind(function(data) {
        this.removeInfoWindow();
        this.setInfoWindow(data.payload[0], event);
      }, this ));
    },

    removeInfoWindow: function() {
      if(this.infowindow) {
        this.infowindow.remove();
      }
    },

    getBoundsPolygon: function() {
      var bounds = this.map.getBounds(),
          nlat = bounds.getNorthEast().lat(),
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

  });

  return UrthecastLayer;

});
