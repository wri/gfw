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

  $(".infowindow").draggable({ containment: "#map-container .map", handle: ".header" });
  $(".infowindow .close").on("click", function(e) {
    e.preventDefault();
    $(".infowindow").animate({ marginTop: 50, opacity: 0}, 250, "easeOutExpo", function() {
      $(this).hide();
    });
  });

  $(".filters").on("mouseenter", function() {
    $("#layers").animate({ opacity: 1 }, 150);
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
    console.log("closing", c);

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


  /*var pids = [];

  $(".filters li").on("mouseenter", openFilter);
  $("#layer").on("mouseleave", closeFilter);
  $("#layers ul").on("mouseenter", protectFilter);
  $("#layers ul").on("mouseleave", closeFilter);

  function protectFilter() {
    var c   = $(this).attr("class");
    cancelClose(c);
  }

  function closeFilter() {
    var c = $(this).attr("class");

    pids[c] = setTimeout(function() {
      close(c);
    }, 20);
  }

  function cancelClose(c) {
    clearTimeout(pids[c]);
  }

  function close(filterClass) {
    var
    $filter     = $(".filters li." + filterClass),
    $content    = $("#layers ul." + filterClass);

    $content.animate({ opacity: 0 }, 150, function() {
      $(this).css("left", -100);
    });

    $("#layer").animate({opacity:0}, 150, function() {
      $(this).css("left", 0);
    });
  }

  function openFilter() {

    var
    $filter      = $(this),
    filterClass  = $filter.attr("class"),
    $content     = $("#layers ul." + filterClass),
    contentWidth = $content.width(),
    $line        = $filter.find(".line"),
    lineWidth    = $line.width();

    protectFilter(filterClass);

    var
    l      = $filter.data("left-pos"),
    $layer = $("#layer"),
    lw     = $layer.width();

    $layer.css({ opacity: 0, left: (l + $filter.width() / 2) - ($layer.width() / 2), top: -100});
    $layer.animate({opacity:1}, 150);
  }*/

  /*var pids = [];
  $(".filters").on("mouseenter", showIcons);
  $(".filters").on("mouseleave", hideIcons);
  $(".filters li").on("mouseenter", openFilter);
  $(".filters li").on("mouseleave", closeFilter);
  $("#layers ul").on("mouseenter", protectFilter);
  $("#layers ul").on("mouseleave", closeFilter);

  function hideIcons() {
    $(".filters li").each(function(i, el) {
      $(el).find(".icon").animate({ top: -20}, 250);
    });
  }

  function showIcons() {
    $(".filters li").each(function(i, el) {
      $(el).find(".icon").animate({ top: 0}, 250);
    });
  }

  function protectFilter() {
    var c   = $(this).attr("class");
    cancelClose(c);
  }

  function closeFilter() {
    var c = $(this).attr("class");

    pids[c] = setTimeout(function() {
      close(c);
    }, 20);
  }

  function cancelClose(c) {
    clearTimeout(pids[c]);
  }

  function close(filterClass) {
    var
    $filter     = $(".filters li." + filterClass),
    $content    = $("#layers ul." + filterClass);

    $content.animate({ opacity: 0 }, 150, function() {
      $(this).css("left", -100);
    });

    $filter.find(".line").animate({bottom: "0", width: $filter.data("line-width") }, 100);
    $filter.find("a").animate({top: "-15px"}, 100);
  }

  function openFilter() {

    var
    $filter      = $(this),
    filterClass  = $filter.attr("class"),
    $content     = $("#layers ul." + filterClass),
    contentWidth = $content.width(),
    $line        = $filter.find(".line"),
    lineWidth    = $line.width();

    cancelClose(filterClass);

    $content.css("left", $filter.data("left-pos"));
    $content.animate({ opacity:1 }, 150, "easeOutQuad");

    if (lineWidth < contentWidth) {
      $filter.data("line-width", lineWidth);
      $line.animate({ bottom: "10px", width: contentWidth }, 100);
    } else {
      $content.css("width", lineWidth);
      $filter.find(".line").animate({ bottom: "10px" }, 100);
    }

    $filter.find("a").animate({top: "-25px"}, 100);
  }*/


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
