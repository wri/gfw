//= require jquery
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.8.20.custom.min
//= require wax.g.min-6.0.4
//= require cartodb-gmapsv3
//= require cartodb-infowindow-min
//= require jquery.history
//= require jstorage.min
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require d3.v2.min
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work

var
map           = null,
previousState = null,
subscribeMap;


// Map init method
function initialize() {

  var
  State = History.getState(),
  hash  = parseHash(State.hash);

  if (hash) {
    config.mapOptions.center = hash.center;
    config.mapOptions.zoom   = hash.zoom;
  }

  // Initialise the google map
  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

  var map_style = {};

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

    //History.log(State.data, State.title, State.url);
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

    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });

  });

  $("nav .countries.ajax").on("click", function(e) {
    e.preventDefault();
    Navigation.showState('countries');
  });

  $(".share_link").on("click", function(e) {
    e.preventDefault();
    $("#content").append('<div class="backdrop" />');
    $(".backdrop").fadeIn(250, function() {

      var top = ( $(window).height() - $("#share").height() ) / 2+$(window).scrollTop() + "px",
      left = ( $(window).width() - $("#share").width() ) / 2+$(window).scrollLeft() + "px";

      $("#share").css({top: top, left:left});
      $("#share").fadeIn(250);
    });
  });

  $(".analysis").on("click", function(e) {
    e.preventDefault();

    $("#content").append('<div class="backdrop" />');
    $(".backdrop").fadeIn(250, function() {

      var top = ( $(window).height() - $("#analysis").height() ) / 2+$(window).scrollTop() + "px",
      left = ( $(window).width() - $("#analysis").width() ) / 2+$(window).scrollLeft() + "px";

      $("#analysis").css({top: top, left:left});
      $("#analysis").fadeIn(250);

    });
  });

  $(".crowdsourcing").on("click", function(e) {
    e.preventDefault();

    $("#content").append('<div class="backdrop" />');
    $(".backdrop").fadeIn(250, function() {

      var top = ( $(window).height() - $("#crowdsourcing").height() ) / 2+$(window).scrollTop() + "px",
      left = ( $(window).width() - $("#crowdsourcing").width() ) / 2+$(window).scrollLeft() + "px";

      $("#crowdsourcing").css({top: top, left:left});
      $("#crowdsourcing").fadeIn(250);

    });
  });

  $(".close_icon").on("click", function(e) {
    e.preventDefault();
    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });

    $("#share, #subscribe, #analysis, #crowdsourcing, #other_wri_sites").fadeOut(250);

  });

  $("#subscribe .map").on("click", function(e) {
    SubscriptionMap.clearMapErrors();
  });

  $("#subscribe .input-field").on("click", function(e) {
    SubscriptionMap.clearEmailErrors();
  });

  $("#share, #subscribe, #analysis, #crowdsourcing, #other_wri_sites").on("click", function(e) {
    e.stopPropagation();
  });

  $(".wri.selector").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $("#other_wri_sites").fadeIn(250);
  });

  $(".subscribe").on("click", function(e) {
    e.preventDefault();
    SubscriptionMap.show();
  });

  $('#subscribe .remove').on("click", function(e){
    e.preventDefault();
    SubscriptionMap.remove();
  });

  $('#subscribe .btn').on("click", function(e){
    e.preventDefault();
    SubscriptionMap.submit();
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
  resizePID;

  function hideOvers() {

    if ($("#share:visible").length > 0) {
      $("#share").fadeOut(250);
      $(".backdrop").fadeOut(250);
    }

    if ($("#crowdsourcing:visible").length > 0) {
      $("#crowdsourcing").fadeOut(250);
      $(".backdrop").fadeOut(250);
    }

    if ($("#analysis:visible").length > 0) {
      $("#analysis").fadeOut(250);
      $(".backdrop").fadeOut(250);
    }

    if ($("#subscribe:visible").length > 0) {
      $("#subscribe").fadeOut(250);
      $(".backdrop").fadeOut(250);
    }

    if ($("#other_wri_sites:visible").length > 0) {
      $("#other_wri_sites").fadeOut(250);
    }
  }

  $(".backdrop").on("click", function(e) {
    hideOvers();
  });

  $(document).on("click", function(e) {
    hideOvers();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      hideOvers();
    } // esc
  });

  $(window).resize(function() {
    clearTimeout(resizePID);
    resizePID = setTimeout(function() { resizeWindow(); }, 100);
  });

  function resizeWindow(e) {
    if (showMap) {
      GFW.app.open();
      Filter.calcFiltersPosition();
    }
  }

  if ($("div[data-load]:visible").length > 0) {
    updateFeed({countryCode: countryCode, n: 4});
    addCircle("forest", "bars", { legendUnit: "m", countryCode: countryCode, width: 300, title: "Height", subtitle:"Tree height distribution", legend:"with {{n}} tall trees", hoverColor: "#333333", color: "#333333", unit: "km<sup>2</sup>" });
    addCircle("forma", "lines", { countryCode: countryCode, width: 300, title: "FORMA", subtitle:"Forest clearing alerts", legend:"In the last month", hoverColor: "#A1BA42", color: "#A1BA42" });
  }

});
