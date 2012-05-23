//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work
var map = null;

$(function(){
  var
  renderPolygonListener = null,
  polygonPath           = [],
  polygon               = null;


  var p = 0;
  $(".advance").on("click", function() {
    var
    $inner = $(".filters .inner"),
    $el    = $inner.find("li:nth(" + p +")"),
    width  = $el.width() + 1;

    $(".filters .inner").animate({ left:"-=" + width }, 250, "easeInExpo", function() {
      $(this).find('li:last').after($el);
      $(this).css("left", 0);
    });
  });

  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);
  map.mapTypes.set('GfwStyle', config.gfwStyle);
  map.setMapTypeId('GfwStyle');

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    config.mapLoaded = true;
    addCircle();
  });

  function addCircle() {
    var $circle = $('<div class="circle"><div class="inner"><div class="counter"></div><div class="title"></div></div></div>');

    $circle.find(".counter").html(summary.count);
    $circle.find(".title").html(summary.title);

    $("#map").append($circle);
    $circle.delay(250).animate({ top:'50%', marginTop:-1*($circle.height() / 2), opacity: 1 }, 250, "easeOutExpo", function() {
      $circle.find(".inner .title").animate({ opacity: 0.75 }, 250, "easeOutExpo");
      $circle.find(".inner .counter").animate({ opacity: 1 }, 250, "easeOutExpo");
    });
  }

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
  $('#map-container').find('.save-area').submit(function(e){
    e.preventDefault();
    $(this).closest('#map-container').toggleClass('editing-mode');

    $(this).find('#area_the_geom').val("ST_GeomFromGeoJSON('" + JSON.stringify({
      "type": "Polygon",
      "coordinates": [
        [
          $.map(polygonPath, function(latlong, index){
        return [latlong.lng(), latlong.lat()];
      })]]
    }) + "')");

    $.post($(this).attr('action'), $(this).serialize(), function(response){
      google.maps.event.removeListener(renderPolygonListener);
      renderPolygonListener = null;
    });
  });
});
