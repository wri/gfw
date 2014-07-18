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
    }

  });

  return MongabayStoriesLayer;

});
