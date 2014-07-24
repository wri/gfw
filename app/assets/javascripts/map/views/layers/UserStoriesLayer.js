/**
 * The UserStories layer module.
 *
 * @return UserStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/MarkersLayerClass',
  'services/UserStoryService',
], function(MarkersLayerClass, UserStoryService) {

  'use strict';

  var UserStoriesLayer = MarkersLayerClass.extend({

    service: UserStoryService,

    options: {
      icon: '/assets/icons/marker_exclamation.png',
      thumbnail: true
    }

  });

  return UserStoriesLayer;

});
