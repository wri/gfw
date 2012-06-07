//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.8.20.custom.min
//= require wax.g.min-6.0.4
//= require jstorage.min
//= require jquery.history
//= require cartodb-gmapsv3-min
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work

var
map           = null,
previousState = null;

function initialize() {

  var
  State = History.getState(),
  hash  = parseHash(State.hash);

  if (hash) {
    config.mapOptions.center = hash.center;
    config.mapOptions.zoom   = hash.zoom;
  }

  // initialise the google map
  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

  var style = "#gfw2_layerstyles{ polygon-fill:#FF6600; polygon-opacity: 0.5; line-opacity:0.1; line-color: #FFFFFF; [name='timber_conc_indonesia']{ polygon-fill:#aa7722; } [name='cog_lc_1']{ polygon-fill:#0ff000; } [name='idn_lc_1']{ polygon-fill:#fff; } [name='gab_lc_1']{ polygon-fill:#fff0ff; } [name='gab_lc_2']{ polygon-fill:#ffff0f; } [name='cmr_lc_1']{ polygon-fill:#7711aa; } [name='idn_oc_1']{ polygon-fill:#fa0f99; } [name='idn_tc_1']{ polygon-fill:#000; } [name='cod_mc_1']{ polygon-fill:red; } [name='cod_lc_2']{ polygon-fill:#ffff00; } [name='cod_lc_1']{ polygon-fill:#fff0f0; } [name='caf_lc_1']{ polygon-fill:#0000ff; } [name='cmr_tc_1']{ polygon-fill:#0000ff; } }";


  var cartodb_gmapsv3 = new CartoDBLayer({
    map: map,
    user_name:'wri-01',
    table_name: 'gfw2_layerstyles',
    query: "SELECT cartodb_id, the_geom_webmercator, 'cod_mc_1' as name FROM gfw2_layerstyles UNION ALL SELECT cartodb_id, the_geom_webmercator, 'caf_lc_1' as name FROM gfw2_layerstyles",
    layer_order: 10,
    tile_style: style,
    opacity:0,
    interactivity: "cartodb_id, name",
    featureMouseClick: function(ev, latlng, data) { console.log(data); },
    featureMouseOut: function(ev) {  },
    featureMouseOver: function(ev, latlng, data) { console.log(data); },
    debug:true,
    auto_bound: false
  });

  var baseHansen = new CartoDBLayer({
    map: map,
    user_name:'wri-01',
    table_name: 'hansen_data',
    query: "SELECT * FROM hansen_data WHERE z=CASE WHEN 8<4 THEN 16 ELSE 4+8 END",
    layer_order: "bottom",
    auto_bound: false
  });

  var baseFORMA = new CartoDBLayer({
    map: map,
    user_name:'wri-01',
    table_name: 'forma_zoom_polys',
    query: "SELECT the_geom_webmercator,alerts,z FROM forma_zoom_polys WHERE z=CASE WHEN 8<3 THEN 16 ELSE 3+8 END",
    layer_order: "bottom",
    auto_bound: false
  });

  var map_style = {};

  // Custom styles
  /*map.mapTypes.set('forests', config.mapStyles.forestHeight);
  map.mapTypes.set('forests_soft', config.mapStyles.forestSoft);*/

  // Default styles
  /*map_style.google_maps_customization_style = config.mapStyles;
  map.setOptions({ styles: map_style.google_maps_customization_style });*/

  /*GFW(function(env) {
    GFW.app = new env.app.Instance(map, {
      user       : 'wri-01',
      layerTable : 'layerinfo',
      logging    : true
    });
    GFW.app.run();
    GFW.env = env;
  });*/
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
