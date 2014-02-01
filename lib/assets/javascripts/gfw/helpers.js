var config = {
  ZOOM:         3,
  MINZOOM:      3,
  MAXZOOM:      17,
  LAT:          15,
  LNG:          27,
  ISO:          'ALL',
  MONTHNAMES:         ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHNAMES_SHORT:   ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  QUARTERNAMES:       ["JAN - MAR", "APR - JUN", "JUL - SEP", "OCT - DEC"],
  BASE_MAP_STYLE:     [ { "featureType": "water"  }, { "featureType": "transit", "stylers": [ { "saturation": -100 } ] }, { "featureType": "road", "stylers": [ { "saturation": -100 } ] }, { "featureType": "poi", "stylers": [ { "saturation": -100 } ] }, { "featureType": "landscape", "stylers": [ { "saturation": -100 } ] }, { "featureType": "administrative", "stylers": [ { "saturation": -100 } ] } ]
};

config.MAPOPTIONS = {
  zoom:     config.ZOOM,
  minZoom:  config.MINZOOM,
  maxZoom:  config.MAXZOOM,
  center:   new google.maps.LatLng(config.LAT, config.LNG),
  mapTypeId: google.maps.MapTypeId.TERRAIN,
  backgroundColor: '#99b3cc',
  disableDefaultUI: true,
  panControl: false,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  overviewMapControl: false,
  scrollwheel: false,
  layers: ''
};
