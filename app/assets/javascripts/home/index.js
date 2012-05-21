$(function(){
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    mapLoaded = true;
  });
});
