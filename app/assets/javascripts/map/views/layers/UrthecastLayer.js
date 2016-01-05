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
      urlTemplate:'http://uc.gfw-apis.appspot.com/urthecast/map-tiles{/sat}{/z}{/x}{/y}?cloud_coverage_lte={cloud}&acquired_gte={mindate}T00:00:00Z&acquired_lte={maxdate}T00:00:z00Z',
      urlInfoWindow: 'http://uc.gfw-apis.appspot.com/urthecast/archive/scenes/?geometry_intersects=POINT({lng}+{lat})&cloud_coverage_lte={cloud}&tiled_lte={tileddate}',
      dataMaxZoom: 13,
      infowindowImagelayer: true
    },

    _getInfoWindowUrl: function(params) {
      return new UriTemplate(this.options.urlInfoWindow).fillFromObject({
        lng: params.lng,
        lat: params.lat,
        cloud: params.cloud,
        // mindate: params.mindate,
        // maxdate: params.maxdate,
        tileddate: params.tileddate
      });
    },

    addClick: function() {
      google.maps.event.addListener(this.map, "click", _.bind(function(event) {
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
      }, this ));
    },

    setInfoWindow: function (_data, event) {
      var data = _data;
      var infoWindowOptions = {
        offset: [0, 100],
        infowindowData: {
          acquired: moment(data['acquired']).format("YYYY-MM-DD"),
          platform: data['platform'],
          sensor_platform: data['platform'],
          cloud_coverage: data['cloud_coverage']
        }
      }
      this.infowindow = new CustomInfowindow(event.latLng, this.map, infoWindowOptions);
      this.removeMultipolygon();
      this.drawMultipolygon(data.geometry);
    },

    removeInfoWindow: function() {
      if(this.infowindow) {
        this.infowindow.remove();
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

  });

  return UrthecastLayer;

});
