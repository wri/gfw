/**
 * Greyscale Maptype.
 */
define([], function () {

  'use strict';

  var name = 'grayscale';

  var style = [{
    "featureType": "water"
  }, {
    "featureType": "transit",
    "stylers": [{
      "saturation": -100
    }]
  }, {
    "featureType": "road",
    "stylers": [{
      "saturation": -100
    }]
  }, {
    "featureType": "poi",
    "stylers": [{
      "saturation": -100
    }]
  }, {
    "featureType": "landscape",
    "stylers": [{
      "saturation": -100
    }, {
      "lightness": 90
    }]
  }, {
    "featureType": "administrative",
    "stylers": [{
      "saturation": -100
    }]
  }, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
      "visibility": 'off'
    }]
  }];

  var grayscaleMaptype = function() {
    return new google.maps.StyledMapType(style, {name: name});
  };

  return grayscaleMaptype;
});
