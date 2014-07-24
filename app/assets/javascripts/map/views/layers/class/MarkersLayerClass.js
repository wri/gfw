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
  'views/layers/CustomInfowindow',
  'text!templates/storyInfowindow.handlebars'
], function(Class, _, _string, Handlebars, MarkerClustererLib, CustomInfowindow, tpl) {

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

        var latlng = new google.maps.LatLng(story.lat, story.lng);

        var markerOptions = _.extend({}, this.options, {
          position: latlng
        });

        var marker = new google.maps.Marker(markerOptions);

        var infoWindow = new CustomInfowindow(this.map, {
          className: 'story_infowindow',
          infowindowContent: this.template(story),
          latlng: latlng,
          width: 215,
          offset: [-30, 0],
        });

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
