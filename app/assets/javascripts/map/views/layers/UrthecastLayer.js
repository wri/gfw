/**
 * The Urthecast layer module for use on canvas.
 *
 * @return UrthecastLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
  'uri',
  'map/views/layers/CustomInfowindow',
], function(ImageLayerClass, UriTemplate, CustomInfowindow) {

  'use strict';

  // Key: BAD04ABC498549E3B3CF
  // Secret: 081547A210CA4369B9A69D69E3753D6D

  var UrthecastLayer = ImageLayerClass.extend({
    options: {
      urlTemplate:'http://uc.gfw-apis.appspot.com/urthecast/map-tiles{/sat}{/z}{/x}{/y}?cloud_coverage_lte={cloud}&acquired_gte={mindate}T00:00:00Z&acquired_lte={maxdate}T00:00:z00Z',
      urlInfoWindow: 'https://api.urthecast.com/v1/archive/scenes?geometry_intersects=POINT({lng}+{lat})&cloud_coverage_lte={cloud}&acquired_gte={mindate}&acquired_lte={maxdate}&api_key=BAD04ABC498549E3B3CF&api_secret=081547A210CA4369B9A69D69E3753D6D&',
      dataMaxZoom: 13,
      infowindow: true
    },

    addClick: function() {
      google.maps.event.addListener(this.map, "click", _.bind(function(event) {
        var options = _.extend({}, this._getParams(), {
          lng: event.latLng.lng(),
          lat: event.latLng.lat(),
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
          name: data['cloud_coverage'],
          country: data['cloud_coverage'],
          status: data['cloud_coverage'],
          date_create: data['acquired'],
          area_ha: data['cloud_coverage'].toLocaleString(),
          category:data['cloud_coverage'],
          source: data['cloud_coverage'],
        }
      }
      this.infowindow = new CustomInfowindow(event.latLng, this.map, infoWindowOptions);
      this.deleteMultipolygon();
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

    deleteMultipolygon: function() {
      if (!!this.multipolygon) {
        this.map.data.remove(this.multipolygon);
      }
    },

    setStyle: function() {
      this.style = {
        strokeWeight: 2,
        fillOpacity: 0,
        fillColor: '#FFF',
        strokeColor: '#A2BC28',
        icon: new google.maps.MarkerImage(
          '/assets/icons/marker_exclamation.png',
          new google.maps.Size(36, 36), // size
          new google.maps.Point(0, 0), // offset
          new google.maps.Point(18, 18) // anchor
        )
      };

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
