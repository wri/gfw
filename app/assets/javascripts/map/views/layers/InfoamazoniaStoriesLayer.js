/**
 * The Infoamazonia Story layer module.
 *
 * @return InfoamazoniaStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'handlebars',
  'abstract/layer/MarkersLayerClass',
  'map/services/InfoamazoniaStoryService',
  'map/views/layers/CustomMarker',
  'map/views/layers/CustomInfowindow'
], function(_, Handlebars , MarkersLayerClass, InfoamazoniaStoryService, CustomMarker, CustomInfowindow) {

  'use strict';

  var InfoamazoniaStoriesLayer = MarkersLayerClass.extend({

    service: InfoamazoniaStoryService,

    _setMarker: function(stories) {
      this.infowindows = [];

      this.markers = _.map(stories, function(story) {

        story.title = _.str.truncate(story.title, 34);

        var markerOptions, infoWindowOptions;

        var latlng = new google.maps.LatLng(story.latlng[1], story.latlng[0]);

        infoWindowOptions = {
          className: 'story-infowindow',
          infowindowContent: this.template({
            loc: story.permalink,
            title: story.title
          }),
          offset: [-30, -16],
          latlng: latlng,
          width: 215
        };

        markerOptions = _.extend(this.options, {
          size: [10, 10],
          offset: [-10, -10],
          /*icon: story.marker.iconUrl*/
          icon: '/assets/icons/infoamazonia_exclamation.png'
        });

        var marker = new CustomMarker(latlng, this.map, markerOptions);

        google.maps.event.addListener(marker, 'click', _.bind(function() {
          if (this.infowindow) {
            this.infowindow.remove();
          }
          this.infowindow = new CustomInfowindow(latlng, this.map, infoWindowOptions);
        }, this));

        return marker;
      }, this);

      _.each(this.markers, function(marker) {
        marker.setMap(this.map);
      }, this);
    },

  });

  return InfoamazoniaStoriesLayer;

});
