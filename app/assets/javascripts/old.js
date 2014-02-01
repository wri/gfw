$(function() {
  var map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

  var styledMap = new google.maps.StyledMapType(config.BASE_MAP_STYLE, { name: 'terrain_style' });
  map.mapTypes.set('terrain_style', styledMap);
  map.setMapTypeId('terrain_style');
});
