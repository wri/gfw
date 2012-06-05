//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.8.20.custom.min
//= require wax.g
//= require jquery.history
//= require cartodb-gmapsv3
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= jstorage.min
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work
var map = null;
var previousState = null;

function initialize() {
  // initialise the google map
  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

  var forestHeight = new google.maps.ImageMapType({
    getTileUrl: function(ll, z) {
      var X = ll.x % (1 << z);  // wrap
      return "http://api.tiles.mapbox.com/v3/cartodb.Forest-Height-Test/" + z + "/" + X + "/" + ll.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    maxZoom: 7,
    name: "Forest Height",
    alt: "Global forest height"
  });

  var forestSoft = new google.maps.ImageMapType({
    getTileUrl: function(ll, z) {
      var X = ll.x % (1 << z);  // wrap
      return "http://api.tiles.mapbox.com/v3/cartodb.global-forest-height/" + z + "/" + X + "/" + ll.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    maxZoom: 7,
    name: "Forest Height",
    alt: "Global forest height"
  });

  var Road = function(){
    this.Road = function(){
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setOptions({styles: null});
    };
  };

  var Satellite = function(){
    this.Satellite = function(){
      map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      map.setOptions({styles: null});
    };
  };

  var Forest = function(){
    this.Forest = function(){
      map.setMapTypeId('forests');
      map.setOptions({styles: null});
    };
  };

  var ForestSoft = function(){
    this.ForestSoft = function(){
      map.setMapTypeId('forests_soft');
      map.setOptions({styles: null});
    };
  };

  var Soft = function(){
    this.Soft = function(){
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setOptions({styles: map_style.google_maps_customization_style});
    };
  };

  var map_style = {};

  map.mapTypes.set('forests', forestHeight);
  map.mapTypes.set('forests_soft', forestSoft);

  map_style.google_maps_customization_style = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative", stylers: [ { saturation: -95 },{ gamma: 2.26 } ] }, { featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] }, { featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }, { featureType: "road.arterial", stylers: [ { visibility: 'off' } ] }, { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] }, { featureType: "transit", stylers: [ { visibility: 'off' } ] }, { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];

  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  map.setOptions({styles: map_style.google_maps_customization_style});

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
      } else if (State.title === 'Map') {
        Navigation.showState("map");
      }

      previousState = State.title;
    }
  });

  $("nav .home.ajax").on("click", function(e) {
    e.preventDefault();
    History.pushState({ state: 2 }, "Home", "/");
  });

  $("nav .map.ajax").on("click", function(e) {
    e.preventDefault();
    History.pushState({ state: 1 }, "Map", "/map");
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
