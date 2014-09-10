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
  'map/views/layers/CustomMarker',
  'map/views/layers/CustomInfowindow',
  'text!map/templates/storyInfowindow.handlebars'
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

    init: function(layer, options, map) {
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

        var thumb = !!(this.options.template && story.media && story.media[1] && story.media[1].preview_url !== '');

        infoWindowOptions = {
          className: 'story-infowindow',
          infowindowContent: this.template(story),
          latlng: latlng,
          width: 215
        };

        if (thumb) {
          infoWindowOptions = _.extend({}, infoWindowOptions, {
            offset: [-42, -3]
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

        var marker = new CustomMarker(latlng, this.map, markerOptions);

        google.maps.event.addListener(marker, 'click', _.bind(function() {
          if (this.infowindow) {
            this.infowindow.remove();
          }
          this.infowindow = new CustomInfowindow(latlng, this.map, infoWindowOptions);
        }, this));

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

    addLayer: function(position, success) {
      this._getLayer();
      success();
    },

    removeLayer: function() {
      if (this.clusterMarkers) {
        this.clusterMarkers.clearMarkers();
      }

      if (this.infowindow) {
        this.infowindow.remove();
      }

      _.each(this.markers, function(marker) {
        marker.setMap(null);
      });
    }

  });

  return MarkersLayerClass;
});
