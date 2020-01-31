/**
 * The Infoamazonia Story layer module.
 *
 * @return InfoamazoniaStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'handlebars',
  'abstract/layer/MarkersLayerClass',
  'map/services/InfoamazoniaStoryService'
], function(_, Handlebars , MarkersLayerClass, InfoamazoniaStoryService) {

  'use strict';

  var InfoamazoniaStoriesLayer = MarkersLayerClass.extend({

    service: InfoamazoniaStoryService,

    options: {
      icon: '/assets/icons/infoamazonia_exclamation.png',
      clusters: true,
      clustersOptions: {
        gridSize: 50,
        styles: [{
          textColor: '#ffffff',
          url: '/assets/icons/marker_cluster_ejn.png',
          width: 36,
          height: 36
        }],
        maxZoom: 15
      }
    }

  });

  return InfoamazoniaStoriesLayer;

});
