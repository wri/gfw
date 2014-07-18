/**
 * The Mongabay Stories layer module.
 *
 * @return MongabayStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/MarkersLayerClass',
  'services/MongabayStoryService'
], function(MarkersLayerClass, MongabayStoryService) {

  'use strict';

  var MongabayStoriesLayer = MarkersLayerClass.extend({

    service: MongabayStoryService,

    options: {
      icon: '/assets/icons/mongabay_exclamation.png'
    },

    _setMarker: function(stories) {
      this.markers = _.map(stories, function(story) {
        var markerOption = _.extend({}, this.options, {
          position: new google.maps.LatLng(story.lat, story.lng),
          map: this.map,
          thumbnail_url: story.thumbnail,
          type: 'mongabay'
        });
        return new google.maps.Marker(markerOption);
      }, this);
    },

  });

  return MongabayStoriesLayer;

});
