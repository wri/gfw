//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.8.20.custom.min
//= require jquery.history
//= require lodash.min
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work

var map = null;

(function(window,undefined){

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
    });

    $("nav .map").on("click", function(e) {
      e.preventDefault();
      History.pushState({state:1}, "State 1", "?state=1");
    });

    return false;

})(window);

$(function(){

  var
  renderPolygonListener = null,
  polygon               = null,
  polygonPath           = [];


  $(document).on("click", function(e) {
    closeFilter();
  });

  $(".filters").on("mouseenter", function() {
    $("#layers").animate({ opacity: 1 }, 150);
  });

  $("#layer").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  function calcFiltersPosition() {
    $(".filters li").each(function(i, el) {
      $(el).data("left-pos", $(el).offset().left);
    });
  }

  function advanceFilter(e) {
    e.preventDefault();

    var
    $inner = $(".filters .inner"),
    $el    = $inner.find("li:first"),
    width  = $el.width() + 1;

    $(".filters .inner").animate({ left:"-=" + width }, 250, "easeInExpo", function() {
      $(this).find('li:last').after($el);
      $(this).css("left", 0);

      calcFiltersPosition();
    });
  }

  calcFiltersPosition();
  $(".advance").on("click", advanceFilter);

  $(".filters li").on("mouseenter", openFilter);
  $("#layer").on("mouseleave", closeFilter);

  var pids ;

  function closeFilter() {
    var c = $(this).attr("class");

    if (c === undefined) return;

    pids = setTimeout(function() {
      close(c);
    }, 100);
  }

  function close(c) {
    $("#layer").animate({opacity:0}, 150, function() {
      $("#layer").css("left", -10000);
      $(this).removeClass(c);
    });
  }

  var lastClass = null;

  function openFilter() {

    var
    $filter      = $(this),
    filterClass  = $filter.attr("class"),
    l            = $filter.data("left-pos"),
    $layer       = $("#layer"),
    lw           = $layer.width(),
    left         = (l + $filter.width() / 2) - (lw / 2),
    $line        = $filter.find(".line"),
    lineWidth    = $line.width();

    cancelClose();

    $layer.removeClass(lastClass);
    $layer.find("a").text($filter.find("a").text());
    $layer.addClass(filterClass);
    lastClass = filterClass;

    $layer.css({ left: left, top: -80});
    $layer.animate({ opacity: 1}, 250);
  }

  function cancelClose() {
    clearTimeout(pids);
  }


  $(".checkbox").on("click", function(e) {
    e.preventDefault();
    $(this).toggleClass("checked");

  });

  if ($("#map").length > 0) {
    map = new google.maps.Map(document.getElementById("map"), config.mapOptions);
    map.mapTypes.set('GfwStyle', config.gfwStyle);
    map.setMapTypeId('GfwStyle');

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
      config.mapLoaded = true;
      Circle.show();
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


  }

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
    $(this).find('#area_the_geom').val(JSON.stringify({
        "type": "MultiPolygon",
        "coordinates": [
            [
                $.map(polygonPath, function(latlong, index){
                  return [[latlong.lng(), latlong.lat()]];
                })
            ]
        ]
    }));

    $.post($(this).attr('action'), $(this).serialize(), function(response){
      google.maps.event.removeListener(renderPolygonListener);
      renderPolygonListener = null;
    });
  });
});
