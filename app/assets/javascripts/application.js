//= require jquery
//= require jquery_ujs
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work
var map = null;

$(function(){
  var renderPolygonListener = null
    , polygonPath = []
    , polygon = null
    ;

  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);
  map.mapTypes.set('GfwStyle', config.gfwStyle);
  map.setMapTypeId('GfwStyle');

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    config.mapLoaded = true;
  });


  function ZoomIn(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_in');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = map.getZoom() + 1;
      if (zoom<20) {
        map.setZoom(zoom);
      }
    });
  }

  function ZoomOut(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_out');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = map.getZoom() - 1;
      if (zoom>2) {
        map.setZoom(zoom);
      }
    });
  }

  var overlayID =  document.getElementById("zoom_controls");

  // zoomIn
  var zoomInControlDiv = document.createElement('DIV');
  overlayID.appendChild(zoomInControlDiv);

  var zoomInControl = new ZoomIn(zoomInControlDiv, map);
  zoomInControlDiv.index = 1;

  // zoomOut
  var zoomOutControlDiv = document.createElement('DIV');
  overlayID.appendChild(zoomOutControlDiv);

  var zoomOutControl = new ZoomOut(zoomOutControlDiv, map);
  zoomOutControlDiv.index = 2;

  // Enables map editing mode. When activated, each click in the map draws a polyline
  $('#map-container').find('.draw-area').click(function(){
    $(this).closest('#map-container').toggleClass('editing-mode');

    if (renderPolygonListener) return;

    polygonPath = [];

    polygon = new google.maps.Polygon({
      paths: [],
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });

    polygon.setMap(map);

    renderPolygonListener = google.maps.event.addListener(map, 'click', function(e){
      polygonPath.push(e.latLng);
      polygon.setPath(polygonPath);
    });
  });

  // Disables editing mode. Sends the created polygon to cartodb.
  $('#map-container').find('.save-area')
  .submit(function(e){
    e.preventDefault();
    $(this).closest('#map-container').toggleClass('editing-mode');
    $(this).find('#area_the_geom').val("ST_GeomFromGeoJSON('" + JSON.stringify({
        "type": "Polygon",
        "coordinates": [
            [
                $.map(polygonPath, function(latlong, index){
                  return [latlong.lng(), latlong.lat()]
                })
            ]
        ]
    }) + "')");

    $.post($(this).attr('action'), $(this).serialize(), function(response){
      google.maps.event.removeListener(renderPolygonListener);
      renderPolygonListener = null;
    });
  });
});
