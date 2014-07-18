/**
 * The JSON map layer module.
 * @return JSONLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  'uri'
], function(Class, _, UriTemplate) {

  'use strict';

  var MarkersLayerClass = Class.extend({


    defaults: {},

    init: function(layer, map) {
      this.markers = [];
      this.map = map;
      this.options = _.extend({}, this.defaults, this.options || {});
    },

    _getLayer: function() {
      var deferred = new $.Deferred();

      if (this.service) {
        this.service.fetchStories(
          _.bind(function(stories) {

            this.markers = _.map(stories, function(story) {
              var markerOption = _.extend({}, this.options, {
                position: new google.maps.LatLng(story.lat, story.lng),
                map: this.map
              });
              return new google.maps.Marker(markerOption);
            }, this);

            deferred.resolve(this.markers);

          }, this),
          this._handlerError
        );
      } else {
        deferred.resolve(this.markers);
        throw 'Service is required';
      }

      return deferred.promise();
    },

    _handlerError: function(xhr, textStatus) {
      throw textStatus;
    },

    addLayer: function() {
      this._getLayer();
    },

    removeLayer: function() {
      _.each(this.markers, function(marker) {
        marker.setMap(null);
      });
    }

  });

  return MarkersLayerClass;
});
