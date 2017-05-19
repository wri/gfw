define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'topojson',
  'helpers/geojsonUtilsHelper',
  'mps'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  topojson,
  geojsonUtilsHelper,
  mps) {

  'use strict';

  var MapCountry = Backbone.View.extend({

    el: '#map',

    /**
     * Google Map Options.
     */
    default: {
      minZoom: 1,
      backgroundColor: '#99b3cc',
      disableDefaultUI: true,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      overviewMapControl: false,
      tilt: 0,
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      zoom: 4
    },

    attributions: [
      {
        id: 'dark',
        attribution: 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.',
      },
      {
        id: 'positron',
        attribution: 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.',
      },
      {
        id: 'openstreet',
        attribution: 'Map tiles by <a href="http://www.openstreetmap.org/">Open street map</a>',
      },
    ],

    initialize: function(params, options) {
      this.paramsMap = _.extend({}, this.default, params);
      var resTopojson = JSON.parse(params.countryData.topojson);
      var objects = _.findWhere(resTopojson.objects, {
        type: 'MultiPolygon'
      });
      var topoJson = topojson.feature(resTopojson,objects),
          geojson = topoJson.geometry,
          bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
          
      this.render(bounds);
    },

    render: function(bounds) {
      this.map = new google.maps.Map(this.el, this.paramsMap);
      this.map.fitBounds(bounds)
    }

  });
  return MapCountry;
});
