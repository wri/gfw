/**
 * Greyscale Maptype.
 */
define([], function () {

  'use strict';

  var name = 'grayscale';

  var style = [{
    'featureType': 'water',
    'stylers': [{
      'hue': '#B3E2FF'
    }]
  }, {
    'featureType': 'transit',
    'stylers': [{
      'saturation': -100
    }]
  }, {
    'featureType': 'road',
    'stylers': [{
      'saturation': -100
    }]
  }, {
    'featureType': 'poi',
    'stylers': [{
      'visibility': 'off'
    }]
  }, {
    'featureType': 'landscape',
    'stylers': [{
      'saturation': -100
    }, {
      'lightness': 90
    }]
  }, {
    'featureType': 'landscape',
    'elementType': 'labels',
    'stylers': [
      { 'saturation': 50 },
      { 'invert_lightness': true },
      { 'lightness': 50 },
      { 'color': '#333333' },
      { 'weight': 0.3 }
    ]
  }, {
    'featureType': 'administrative',
    'stylers': [{
      'saturation': -100
    }]
  }, {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [{
      'visibility': 'off'
    }]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels',
    'stylers': [{
      'visibility': 'off'
    }]
  }];

  var grayscaleMaptype = function() {
    return new google.maps.StyledMapType(style, {name: name});
  };

  return grayscaleMaptype;
});
