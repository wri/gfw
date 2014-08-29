/**
 * The UserStories layer module.
 *
 * @return UserStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'handlebars',
  'views/layers/class/MarkersLayerClass',
  'services/UserStoryService',
  'text!templates/thumbMarker.handlebars'
], function(Handlebars , MarkersLayerClass, UserStoryService, markerTemplate) {

  'use strict';

  var UserStoriesLayer = MarkersLayerClass.extend({

    service: UserStoryService,

    options: {
      icon: '/assets/icons/marker_exclamation.png',
      template: Handlebars.compile(markerTemplate)
    }

  });

  return UserStoriesLayer;

});
