/*global MarkerClusterer*/
/**
 * The JSON map layer module.
 * @return JSONLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  '_string',
  'handlebars',
  'markerclusterer',
  'views/layers/CustomMarker',
  'views/layers/CustomInfowindow',
  'text!templates/storyInfowindow.handlebars'
], function(Class, _, _string, Handlebars, MarkerClustererLib, CustomMarker, CustomInfowindow, tpl) {

  'use strict';

  var MarkersLayerClass = Class.extend({


    defaults: {
      clusters: false,
      clustersOptions: {
        gridSize: 50
      }
    },

    template: Handlebars.compile(tpl),

    init: function(layer, map) {
      this.markers = [];
      this.map = map;
      this.options = _.extend({}, this.defaults, this.options || {});
    },

    _getLayer: function() {
      if (this.service) {
        this.service.fetchStories(
          _.bind(this._setMarker, this),
          this._handlerError
        );
      } else {
        throw 'Service is required';
      }
    },

    _handlerError: function(xhr, textStatus) {
      throw textStatus;
    },

    _setMarker: function(stories) {
      this.infowindows = [];

      this.markers = _.map(stories, function(story) {

        story.title = _.str.truncate(story.title, 34);

        var markerOptions, infoWindowOptions;

        var latlng = new google.maps.LatLng(story.lat, story.lng);

        var thumb = !!(this.options.template && story.media[1] && story.media[1].preview_url !== '');

        infoWindowOptions = {
          className: 'story-infowindow',
          infowindowContent: this.template(story),
          latlng: latlng,
          width: 215
        };

        if (thumb) {
          infoWindowOptions = _.extend({}, infoWindowOptions, {
            offset: [-42, -3],
          });
          markerOptions = _.extend({}, this.options, {
            offset: [-30, -30],
            size: [60, 60],
            className: 'thumb-marker',
            content: (thumb) ? this.options.template({ image: story.media[1].preview_url }) : false
          });
        } else {
          infoWindowOptions = _.extend({}, infoWindowOptions, {
            offset: [-30, 0],
          });
          markerOptions = this.options;
        }

        var infoWindow = new CustomInfowindow(this.map, infoWindowOptions);
        var marker = new CustomMarker(latlng, this.map, markerOptions);

        google.maps.event.addListener(marker, 'click', _.bind(function() {
          _.each(this.infowindows, function(infow) {
            infow.hide();
          });
          infoWindow.open();
        }, this));

        this.infowindows.push(infoWindow);

        return marker;
      }, this);

      if (this.options.clusters) {
        this.clusterMarkers = new MarkerClusterer(this.map, this.markers, this.options.clustersOptions);
      } else {
        _.each(this.markers, function(marker) {
          marker.setMap(this.map);
        }, this);
      }
    },

    addLayer: function() {
      this._getLayer();
    },

    removeLayer: function() {
      if (this.clusterMarkers) {
        this.clusterMarkers.clearMarkers();
      }

      _.each(this.infowindows, function(infowindow) {
        infowindow.destroy();
      });
      _.each(this.markers, function(marker) {
        marker.setMap(null);
      });
    }

  });

  return MarkersLayerClass;
});
