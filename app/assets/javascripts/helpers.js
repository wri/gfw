_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var config = {
  ZOOM:               5,
  MINZOOM:            3,
  MAXZOOM:            16,
  LAT:                3,
  LNG:                120,
  MONTHNAMES:         ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHNAMES_SHORT:   ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  YEARS:              [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
  DATE_FORMAT:        "yyyy-MM-dd",
  DATE_SUFFIXES:      ["th", "st", "nd", "rd"],
  MIN_PROJECT_RADIUS: 100
};

config.mapStyles = [{
  featureType: "water",
  stylers: [ { saturation: -34 }, { lightness: 29 } ]
}, {
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [ { visibility: "off" } ]
}, {
  featureType: "road",
  stylers: [ { saturation: -99 }, { lightness: 70 } ]
}, {
  featureType: "poi", stylers: [
    { visibility: "off" }
  ]
}, {
  featureType: "poi",
  elementType: "labels",
  stylers: [ { visibility: "off" } ]
}, {
  featureType: "road",
  elementType: "labels",
  stylers: [ { visibility: "off" } ]
}, {
  featureType: "road"
}, {
  featureType: "administrative",
  stylers: [ { saturation: -98 }, { lightness: 72 } ]
}, {}];

config.mapLoaded = false;
config.gfwStyle = new google.maps.StyledMapType(config.mapStyles, {name: "GFW Style"});

config.mapOptions = {
  zoom:             config.ZOOM,
  minZoom:          config.MINZOOM,
  maxZoom:          config.MAXZOOM,
  center:           new google.maps.LatLng(config.LAT, config.LNG),
  mapTypeId:        google.maps.MapTypeId.SATELLITE,
  disableDefaultUI: true,
  panControl: false,
  zoomControl: false,
  mapTypeControl: true,
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
  scrollwheel: false
};
