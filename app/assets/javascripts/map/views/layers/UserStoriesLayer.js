/**
 * The UserStories layer module.
 *
 * @return UserStoriesLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/MarkersLayerClass',
], function(MarkersLayerClass) {

  'use strict';

  var UserStoriesLayer = MarkersLayerClass.extend({});

  return UserStoriesLayer;

});
