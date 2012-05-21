var
map = null,
mapOptions = {
  zoom: 3,
  center: new google.maps.LatLng(30.14512718337613, -32.51953125),
  mapTypeId: google.maps.MapTypeId.TERRAIN,

  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
  }

},
mapLoaded = false;
