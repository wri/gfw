/**
 * The Mongabay Stories layer module.
 *
 * @return MongabayStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/MarkersLayerClass',
], function(MarkersLayerClass) {

  'use strict';

  var MongabayStoriesLayer = MarkersLayerClass.extend({

    url: 'https://wri-01.cartodb.com/api/v2/sql?q=SELECT * FROM mongabaydb WHERE published >= now() - INTERVAL \'12 Months\'&format=geojson'

  });

  return MongabayStoriesLayer;

});
