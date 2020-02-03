/**
 * The UserStories layer module.
 *
 * @return UserStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'handlebars',
  'abstract/layer/MarkersLayerClass',
  'markerclusterer',
  'map/views/layers/CustomMarker',
  'map/views/layers/CustomInfowindow',
  'map/services/UserStoryService',
  'text!map/templates/thumbMarker.handlebars'
], function(Handlebars, MarkersLayerClass, MarkerClustererLib, CustomMarker, CustomInfowindow, UserStoryService, markerTemplate) {

  'use strict';

  var UserStoriesLayer = MarkersLayerClass.extend({

    service: UserStoryService,

    options: {
      icon: '/assets/icons/marker_exclamation.png',
      template: Handlebars.compile(markerTemplate)
    },

    _setMarker: function(stories) {
      this.infowindows = [];

      this.markers = _.map(stories, function(story) {
        var storyId = story.id;
        story = story.attributes;

        story.title = _.str.truncate(story.title, 68);

        var markerOptions, infoWindowOptions;

        var latlng = new google.maps.LatLng(story.lat, story.lng);

        // var thumb = !!(this.options.template && story.media && story.media[1] && story.media[1].previewUrl !== '');

        infoWindowOptions = {
          className: 'story-infowindow',
          infowindowContent: this.template(story),
          latlng: latlng,
          width: 215
        };

        // if (thumb) {
        //   infoWindowOptions = _.extend({}, infoWindowOptions, {
        //     offset: [-42, -3]
        //   });
        //   markerOptions = _.extend({}, this.options, {
        //     offset: [-30, -30],
        //     size: [60, 60],
        //     className: 'thumb-marker',
        //     // content: (thumb) ? this.options.template({ image: story.media[1].previewUrl }) : false
        //     content: false
        //   });
        // }

        infoWindowOptions = _.extend({}, infoWindowOptions, {
          offset: [-30, 0],
        });
        markerOptions = this.options;


        var marker = new CustomMarker(latlng, this.map, markerOptions);


        google.maps.event.addListener(marker, 'click', _.bind(function() {
          if (!!story.link) {
            var redirectWindow = window.open(story.link, '_blank');
                redirectWindow.location;
          } else {
            var redirectWindow = window.open('/stories/'+storyId, '_blank');
                redirectWindow.location;
          }
        }, this));

        google.maps.event.addListener(marker, 'mouseover', _.bind(function() {
          if (this.infowindow) {
            this.infowindow.remove();
          }
          this.infowindow = new CustomInfowindow(latlng, this.map, infoWindowOptions);
        }, this));

        google.maps.event.addListener(marker, 'mouseout', _.bind(function() {
          if (this.infowindow) {
            this.infowindow.remove();
          }
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


  });

  return UserStoriesLayer;

});
