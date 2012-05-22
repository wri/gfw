//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require_tree .

$(function(){

  var map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

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

});
