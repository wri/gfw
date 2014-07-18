/**
 * The JSON map layer module.
 * @return JSONLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  'uri',
  'services/StoryService'
], function(Class, _, UriTemplate, ss) {

  'use strict';

  var MarkersLayerClass = Class.extend({

    markers: [],

    defaults: {},

    init: function(layer, map) {
      this.layer = layer;
      this.map = map;
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      ss.fetchStories(_.bind(function() {
        this._setMakers();
        deferred.resolve();
      }, this), this._handlerError);
      return deferred.promise();
    },

    _setMakers: function(stories) {
      this.makers = _.map(stories, _.bind(function(story) {
        var markerOptions = _.extend({}, this.defaults, {
          position: new google.maps.LatLng(story.lat, story.lng),
          map: this.map
        });
        return new new google.maps.Marker(markerOptions);
      }, this));
    },

    _handlerError: function(xhr, textStatus) {
      throw textStatus;
    },

    addLayer: function() {
      $.when(this._getLayer()).then(_.bind(function() {
        _.each(this.markers, function(marker) {
          marker.setVisible(true);
        });
      }, this));
    },

    removeLayer: function() {
      _.each(this.markers, function(marker) {
        marker.setVisible(false);
      });
    }

  });

  return MarkersLayerClass;
});
