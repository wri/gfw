//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.8.20.custom.min
//= require wax.g
//= require jstorage.min
//= require jquery.history
//= require cartodb-gmapsv3
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work
var map = null;
var previousState = null;

function initialize() {
  // initialise the google map
  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

  var map_style = {};

  // Custom styles
  map.mapTypes.set('forests', config.mapStyles.forestHeight);
  map.mapTypes.set('forests_soft', config.mapStyles.forestSoft);

  // Default styles
  map_style.google_maps_customization_style = config.mapStyles;
  map.setOptions({ styles: map_style.google_maps_customization_style });

  GFW(function(env) {
    GFW.app = new env.app.Instance(map, {
      user       : 'wri-01',
      layerTable : 'layerinfo',
      logging    : true
    });
    GFW.app.run();
    GFW.env = env;
  });
}

(function(window,undefined){

  // Prepare
  var History = window.History; // Note: We are using a capital H instead of a lower h

  if ( !History.enabled ) {
    // History.js is disabled for this browser.
    // This is because we can optionally choose to support HTML4 browsers or not.
    return false;
  }

  // Bind to StateChange Event
  History.Adapter.bind(window,'statechange', function(){ // Note: We are using statechange instead of popstate
    var State = History.getState(); // Note: We are using History.getState() instead of event.state
    History.log(State.data, State.title, State.url);

    if (previousState != State.title) {
      if (State.title === 'Home') {
        Navigation.showState("home");
      } else if (State.title === 'Countries') {
        Navigation.showState("countries");
      } else if (State.title === 'Map') {
        Navigation.showState("map");
      }

      previousState = State.title;
    }
  });

  /*$(document).keyup(function(e) {
    if (e.keyCode == 27) {

    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });

    $("#countries").fadeOut(250);

    }   // esc
  });*/

  $("nav .home.ajax").on("click", function(e) {
    e.preventDefault();
    History.pushState({ state: 2 }, "Home", "/");

    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });

  });

  $("nav .countries.ajax").on("click", function(e) {
    e.preventDefault();
    History.pushState({ state: 4 }, "Countries", "/countries");


  });

  $("nav .map.ajax").on("click", function(e) {
    e.preventDefault();
    History.pushState({ state: 1 }, "Map", "/map");

    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });
  });

  return false;

})(window);

$(function(){

  var
  renderPolygonListener = null,
  polygon               = null,
  polygonPath           = [],
  resizePID;

  //$(document).on("click", function(e) {
    //Filter.closeOpenFilter();
  //});

  $(document).on("click", ".radio", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $('.radio[data-name="' + $(this).attr('data-name') + '"]').removeClass("checked");
    $(this).addClass("checked");
  });

  $(document).on("click", ".checkbox", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $(this).toggleClass("checked");
  });

  $(window).resize(function() {
    clearTimeout(resizePID);
    resizePID = setTimeout(function() { resizeWindow(); }, 100);
  });

  function resizeWindow( e ) {
    if (showMap) {
      GFW.app.open();
    }
  }

  //  // Enables map editing mode. When activated, each click in the map draws a polyline
  //  $('#map-container').find('.draw-area').click(function(){
  //    $(this).closest('#map-container').toggleClass('editing-mode');

  //    if (renderPolygonListener) return;

  //    polygonPath = [];

  //    polygon = new google.maps.Polygon({
  //      paths: [],
  //      strokeColor: "#FF0000",
  //      strokeOpacity: 0.8,
  //      strokeWeight: 3,
  //      fillColor: "#FF0000",
  //      fillOpacity: 0.35
  //    });

  //    polygon.setMap(map);

  //    renderPolygonListener = google.maps.event.addListener(map, 'click', function(e){
  //      polygonPath.push(e.latLng);
  //      polygon.setPath(polygonPath);
  //    });
  //  });

  //  // Disables editing mode. Sends the created polygon to cartodb.
  //  $('#map-container').find('.save-area').submit(function(e){
  //    e.preventDefault();
  //    $(this).closest('#map-container').toggleClass('editing-mode');
  //    $(this).find('#area_the_geom').val(JSON.stringify({
  //      "type": "MultiPolygon",
  //      "coordinates": [
  //        [
  //          $.map(polygonPath, function(latlong, index){
  //        return [[latlong.lng(), latlong.lat()]];
  //      })
  //      ]
  //      ]
  //    }));

  //    $.post($(this).attr('action'), $(this).serialize(), function(response){
  //      google.maps.event.removeListener(renderPolygonListener);
  //      renderPolygonListener = null;
  //    });
  //  });
  //}

});
