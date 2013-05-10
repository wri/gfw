//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.9.2.custom.min
//= require wax.g.min
//= require cartodb-gmapsv3
//= require cartodb-infowindow-min
//= require protected-infowindow-min
//= require imgLiquid.min
//= require jstorage.min
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require d3.v2.min
//= require geojson
//= require jquery.tipsy
//= require jquery.fileupload
//= require jquery.fileupload-ui
//= require jquery.fileupload-fp
//= require gfw
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work

var
loaded           = false,
map              = null,
previousState    = null,
globalZindex     = 300,
subscribeMap;

GOD               = {},
legend            = {},
analysis          = {},
Timeline          = {},
wall              = {},
sourceWindow      = {},
gallery           = {},
languageSelector  = {},
layerSelector     = {},
Infowindow        = {};

function loadOtherStuff(callback) {

  if ($("body.home.index").length > 0) {
    wall = new gfw.ui.view.Wall();
    $("body").append(wall.render());
  }

  sourceWindow  = new gfw.ui.view.SourceWindow();
  Infowindow    = new CartoDBInfowindow(map, { className: "story_infowindow", width: 215 });

  $("body").append(sourceWindow.render());

  $(".styled.checkbox").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $(this).toggleClass("checked");
    $(this).hasClass("checked") ? $(this).find("input").val(1) : $(this).find("input").val(0);

  });

  gallery           = new gfw.ui.view.Gallery({ title: "Other WRI sites" });
  languageSelector  = new gfw.ui.view.LanguageSelector();

  $("body").append(languageSelector.render());

  $(".more_stories li").on("mouseleave", function(e) {
    var $this = $(this);
    $this.find(".infowindow").fadeOut(50);
  });

  $(".more_stories li").on("mouseenter", function(e) {
    var $this = $(this);
    $this.find(".infowindow").fadeIn(50);
  });

  gallery.addHandler("#other_sites_ribbon");

  languageSelector.addLanguage({ code: "en",    lang: "en", title: "English" });
  languageSelector.addLanguage({ code: "fr",    lang: "fr", title: "French" });
  languageSelector.addLanguage({ code: "es",    lang: "es", title: "Spanish" });
  languageSelector.addLanguage({ code: "pt",    lang: "pt", title: "Portuguese" });
  languageSelector.addLanguage({ code: "id",    lang: "id", title: "Indonesian" });
  languageSelector.addLanguage({ code: "zh-CN", lang: "cn", title: "Chinese" });
  languageSelector.addLanguage({ code: "ru",    lang: "ru", title: "Russian" });
  languageSelector.addLanguage({ code: "ar",    lang: "ar", title: "Arabic" });

  languageSelector.addHandler(".lang_selector a");

  $(".lang_selector a").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    languageSelector.toggleHidden();
    GOD.add(languageSelector, languageSelector.hide);
  });

  Timeline = new gfw.ui.view.Timeline({
    container: $("#map")
  });

  window.timeline = Timeline;

  Circle.init();
  Filter.init();

  $(".scroll").jScrollPane();

  callback && callback();

}

function loadGFW(callback) {

  if (loaded) {

    callback && callback();
    return;
  }

  loaded = true;

  GOD = new gfw.ui.view.GOD();
  window.GOD = GOD;

  map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

  var styledMap = new google.maps.StyledMapType(config.BASE_MAP_STYLE, { name: "terrain_style" });

  map.mapTypes.set("terrain_style", styledMap);
  map.setMapTypeId("terrain_style");

  google.maps.event.addDomListener(map, 'click', function (ev) {
    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
    Infowindow.close();
  });

  google.maps.event.addListener(map, 'maptypeid_changed', function() {
    if (map.getMapTypeId() == 'Tree Height') $("#credit-control").html(config.mapStyles.TREEHEIGHT.alt).fadeIn(250);
    else $("#credit-control").html("").fadeOut(250);
  });

  var creditNode = document.createElement('div');
  creditNode.id = 'credit-control';
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(creditNode);

  google.maps.event.addListenerOnce(map, 'idle', function (ev) {

    GFW(function(env) {

      GFW.app = new env.app.Instance(map, {
        user       : 'wri-01',
        layerTable : 'layerinfo_minus_imazon', // TODO: change back to layerinfo when we have imazon
        logging    : false
      });

      GFW.app.run();
      GFW.env = env;

      loadOtherStuff(callback);

    });

  });

  // Layer selector
  layerSelector = new gfw.ui.view.LayerSelector({ map: map });
  $("#map").append(layerSelector.render());
  layerSelector.setDraggable(true);

  // Legend
  legend = new gfw.ui.view.Legend();
  $("#map").append(legend.render());
  legend.setDraggable(true);

  // Analysis
  analysis = new gfw.ui.view.Analysis({ map: map });
  $("#map").append(analysis.render());
  analysis.info.setDraggable(true);

}

(function(window,undefined){

  if ($("body.countries").hasClass("index")) CountryMenu.drawCountries();

  $("nav .home.ajax").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.router.navigate("", { trigger: true });
    $(".backdrop").fadeOut(250);

  });

  $("nav .countries.ajax").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.router.navigate("countries", { trigger: true });
  });

  $(".share_link").off("click");
  $(".share_link").on("click", function(e) {
    e.preventDefault();
    $(".backdrop").fadeIn(250, function() {

      var top = ( $(window).height() - $("#share").height() ) / 2+$(window).scrollTop() + "px",
      left = ( $(window).width() - $("#share").width() ) / 2+$(window).scrollLeft() + "px";

      $("#share").css({top: top, left:left});
      $("#share").fadeIn(250);
    });
  });

  $(".analysis").off("click");

  $(".analysis").on("click", function(e) {
    e.preventDefault();
    console.log('a');

    $("body").animate({ scrollTop: 0 }, 250, function() {
      analysis._showHelper();
    });

  });

  $(".close_icon").on("click", function(e) {
    e.preventDefault();
    $(".backdrop").fadeOut(250);

    $("#share, #subscribe, #other_wri_sites").fadeOut(250);

  });

  $("#subscribe .map").on("click", function(e) {
    SubscriptionMap.clearMapErrors();
  });

  $("#subscribe .input-field").on("click", function(e) {
    SubscriptionMap.clearEmailErrors();
  });

  $("#share, #subscribe, #other_wri_sites").on("click", function(e) {
    e.stopPropagation();
  });

  $(".wri.selector").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $("#other_wri_sites").fadeIn(250);
  });

  $(".subscribe").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    SubscriptionMap.show();
  });

  $('#subscribe .remove').on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    SubscriptionMap.remove();
  });

  $('#subscribe .btn').on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    SubscriptionMap.submit();
  });

  $("nav .map.ajax").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    var lat = map.getCenter().lat().toFixed(GFW.app._precision);
    var lng = map.getCenter().lng().toFixed(GFW.app._precision);

    var zoom   = config.mapOptions.zoom;
    var layers = config.mapOptions.layers;

    if(layers) {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso + "/" + layers;
      window.router.navigate(hash, { trigger: true, replace: true });
    } else {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.iso;
      window.router.navigate(hash, { trigger: true });
    }

    $(".backdrop").fadeOut(250);

  });

  return false;

})(window);

$(function(){

  var resizePID;

  var Router = Backbone.Router.extend({

    routes: {
      "map":                         "map",
      "map/:zoom/:lat/:lon":              "mapWithCoordinates",
      "map/:zoom/:lat/:lon/:iso":         "mapWithCoordinates",
      "map/:zoom/:lat/:lon/:iso/*layers": "mapWithCoordinates",
      "/":                           "home",
      "":                            "home"
    },

    home: function(query, page) {
      loadGFW( function() {
        Navigation.showState("home");
      });
    },

    map: function() {
      if ($.browser.msie) $(document).scrollTop(0);

      loadGFW( function() {
        Navigation.showState("map");
      });

    },

    mapWithCoordinates: function(zoom, lat, lon, iso, layers) {
      if (lat && lon) { config.mapOptions.center = new google.maps.LatLng(lat, lon); }
      if (zoom)       { config.mapOptions.zoom   = parseInt(zoom, 10); }
      if (layers)     { config.mapOptions.layers = layers; }

      if (!iso) config.iso = "ALL";
      else config.iso = iso;

      loadGFW( function() {
        Navigation.showState("map");
      });

      if (lat && lon) map.setCenter(new google.maps.LatLng(lat, lon));
      if (iso != "ALL") analysis._loadCountry(iso);
    }

  });

  if ($("body.about").length > 0 || $("body.sources").length > 0 || $("body.blog").length > 0 || $("body.countries").length > 0 || $("body.stories").length > 0) {
    loadOtherStuff();
  }

  window.router = new Router;

  $("#layer a.title").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  $("#filters ul.filters li a").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  if ($("body.home.index").length > 0) {
    Backbone.history.start({ pushState: true });
  }

  if ($("body.stories.show .carrousel").length > 0) {
    carrousel = new gfw.ui.view.Carrousel();
  }

  function hideOvers() {

    if ($("#share:visible").length > 0) {
      $("#share").fadeOut(250);
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
      if (GFW.app) GFW.app.open();
      Filter.calcFiltersPosition();
    }
  }

  if ($("div[data-load]:visible").length > 0) {
    addCircle("forest", "bars", { legendUnit: "m", countryCode: countryCode, width: 300, title: "Height", subtitle:"Tree height distribution", legend:"with {{n}} tall trees", hoverColor: "#333333", color: "#333333", unit: "km<sup>2</sup>" });
    addCircle("forma", "lines", { countryCode: countryCode, width: 300, title: "FORMA", subtitle:"Forest clearing alerts", legend:"In the last month", hoverColor: "#A1BA42", color: "#A1BA42" });
  }


});
