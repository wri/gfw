/**
 * The Mongabay Stories layer module.
 *
 * @return MongabayStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'abstract/layer/MarkersLayerClass',
  'map/services/MongabayStoryService'
], function(_, MarkersLayerClass, MongabayStoryService) {

  'use strict';

  var MongabayStoriesLayer = MarkersLayerClass.extend({

    service: MongabayStoryService,

    options: {
      icon: '/assets/icons/mongabay_exclamation.png',
      clusters: true,
      clustersOptions: {
        gridSize: 50,
        styles: [{
          textColor: '#ffffff',
          url: '/assets/icons/marker_cluster.png',
          width: 36,
          height: 36
        }],
        maxZoom: 15
      }
    }

  });

  return MongabayStoriesLayer;

});
