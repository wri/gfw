//= require jquery
//= require jquery.history
//= require jquery_ujs
//= require jquery.easing.1.3
//= require jquery-ui-1.9.2.custom.min
//= require wax.g.min
//= require cartodb-gmapsv3
//= require cartodb-infowindow-min
//= require jstorage.min
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require d3.v2.min
//= require geojson
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
mapAnimationPID      = null,
mapAnimation     = true,
previousState    = null,
globalZindex     = 300,
subscribeMap;

GOD               = {},
legend            = {},
wall              = {},
sourceWindow      = {},
gallery           = {},
languageSelector  = {},
layerSelector     = {},
Infowindow        = {};

function loadGFW() {

  if (loaded) return;

  loaded = true;

    GOD = new gfw.ui.view.GOD();
    window.GOD = GOD;

    if ($("#map").length > 0) {
      map = new google.maps.Map(document.getElementById("map"), config.mapOptions);

      var styledMap = new google.maps.StyledMapType(config.BASE_MAP_STYLE, { name: "terrain_style" });

      map.mapTypes.set("terrain_style", styledMap);
      map.setMapTypeId("terrain_style");

      google.maps.event.addDomListener(map, 'click', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        Infowindow.close();
      });

      layerSelector = new gfw.ui.view.LayerSelector({ map: map });
      legend        = new gfw.ui.view.Legend();
      sourceWindow  = new gfw.ui.view.SourceWindow();
      Infowindow    = new CartoDBInfowindow(map, { className: "story_infowindow", width: 174 });

      $("#map").append(layerSelector.render());
      $("#map").append(legend.render());
      $("body").append(sourceWindow.render());

      legend.setDraggable(true);
      layerSelector.setDraggable(true);
    }

    $(".styled.checkbox").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      $(this).toggleClass("checked");

      if ($(this).hasClass("checked")) {
        $(this).find("input").val(1);
      } else
        $(this).find("input").val(0);

    });

    $("nav ul li a.countries").on("click", CountryMenu.show);

    var sites = [
      new gfw.ui.model.Site({ title: "WRI", description: "Focusing on the intersection of the environment and socio-economic development.", url: "http://www.wri.org/", thumb_url: "/assets/sites/site_wri.png" }),
      new gfw.ui.model.Site({ title: "WRInsights", description: "Unbiased, expert analysis on the most important environmental issues facing the world today.", url: "http://insights.wri.org/", thumb_url: "/assets/sites/site_wriinsights.png" }),
      new gfw.ui.model.Site({ title: "WRI In China",  description: "To be completed.", url: "http://www.wri.org.cn/", thumb_url: "/assets/sites/site_wriinchina.png" }),
      new gfw.ui.model.Site({ title: "ChinaFAQs",  description: "To be completed", url: "http://www.chinafaqs.org/", thumb_url: "/assets/sites/site_chinafaqs.png" }),
      new gfw.ui.model.Site({ title: "TheCity Fix", description: "To be completed", url: "http://thecityfix.com/", thumb_url: "/assets/sites/site_thecityfix.png" }),
      new gfw.ui.model.Site({ title: "Climate Analysis Indicators", description: "To be completed",  url: "http://www.wri.org/tools/cait/", thumb_url: "/assets/sites/site_climateanalysis.png" }),
      new gfw.ui.model.Site({ title: "Electricity Governance", description: "To be completed", url: "http://electricitygovernance.wri.org/", thumb_url: "/assets/sites/site_electricity.png" }),
      new gfw.ui.model.Site({ title: "EMBARQ", description: "To be completed", url: "http://www.embarq.org/", thumb_url: "/assets/sites/site_embarq.png" }),
      new gfw.ui.model.Site({ title: "Forest Legality Alliance", description: "Reducing illegal logging through supporting the supply of legal forest products.", url: "http://www.forestlegality.org/", thumb_url: "/assets/sites/site_forestlegality.png" }),
      new gfw.ui.model.Site({ title: "New Ventures", description: "To be completed", url: "http://www.new-ventures.org/", thumb_url: "/assets/sites/site_newventures.png" }),
      new gfw.ui.model.Site({ title: "Southern Forests for the Future", description: "Raise awareness about the forests of the southern United States", url: "http://www.seesouthernforests.org/", thumb_url: "/assets/sites/site_southernforests.png" }),
      new gfw.ui.model.Site({ title: "World Resources Report", description: "How can the world adequately feed more than 9 billion people by 2050?", url: "http://www.worldresourcesreport.org/", thumb_url: "/assets/sites/site_worldresources.png" })
    ];

    gallery           = new gfw.ui.view.Gallery({ title: "Other WRI sites", sites: sites });
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

    if (map) {
      GFW(function(env) {

        GFW.app = new env.app.Instance(map, {
          user       : 'wri-01',
          layerTable : 'layerinfo',
          logging    : false
        });

        GFW.app.run();
        GFW.env = env;

      });
    }
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

    $(".backdrop").fadeIn(250, function() {
      $("#analysis").fadeIn(250);
    });

  });

  $(".close_icon").on("click", function(e) {
    e.preventDefault();
    $(".backdrop").fadeOut(250);

    //$("#share, #subscribe, #analysis, #crowdsourcing, #other_wri_sites").fadeOut(250);
    $("#share, #subscribe, #analysis, #other_wri_sites").fadeOut(250);

  });

  $("#subscribe .map").on("click", function(e) {
    SubscriptionMap.clearMapErrors();
  });

  $("#subscribe .input-field").on("click", function(e) {
    SubscriptionMap.clearEmailErrors();
  });

  //$("#share, #subscribe, #analysis, #crowdsourcing, #other_wri_sites").on("click", function(e) {
  $("#share, #subscribe, #analysis, #other_wri_sites").on("click", function(e) {
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
    var layers = config.mapOptions.layers || "";

    if (filters) {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + layers;
      window.router.navigate(hash, { trigger: true, replace: true });
    } else {
      hash = "map/" + zoom + "/" + lat + "/" + lng;
      window.router.navigate(hash, { trigger: true });
    }

    $(".backdrop").fadeOut(250);

  });

  return false;

})(window);

$(function(){

  var
  resizePID;

  var Router = Backbone.Router.extend({

    routes: {
      "countries":                   "countries",
      "map":                         "map",
      "map/:zoom/:lat/:lon":         "mapWithCoordinates",
      "map/:zoom/:lat/:lon/*layers": "mapWithCoordinates",
      "/":                           "home",
      "":                            "home"
    },

    countries: function() {
      Navigation.showState('countries');
    },

    map: function() {

      if ($.browser.msie) $(document).scrollTop(0);

      loadGFW();
      Navigation.stopMapAnimation
      Navigation.showState("map");

    },

    mapWithCoordinates: function(zoom, lat, lon, layers) {
      //console.log('map',zoom,lat,lon,layers );

      if (lat && lon) { config.mapOptions.center = new google.maps.LatLng(lat, lon); }
      if (zoom)       { config.mapOptions.zoom   = parseInt(zoom, 10); }
      if (layers)     { config.mapOptions.layers = layers; }

      loadGFW();
      Navigation.stopMapAnimation
      Navigation.showState("map");

      if (lat && lon) map.setCenter(new google.maps.LatLng(lat, lon));

    },

    home: function(query, page) {
      loadGFW();
      Navigation.showState("home");
    }

  });

  window.router = new Router;
  Backbone.history.start({ pushState: true });

  if ($("body.stories.index").length > 0) {
    wall = new gfw.ui.view.Wall();
    $("body").append(wall.render());
  }

  if ($("body.stories.show .carrousel").length > 0) {
    carrousel = new gfw.ui.view.Carrousel();
  }


  // TODO: remove
  window.wall = wall;

  function hideOvers() {

    if ($("#share:visible").length > 0) {
      $("#share").fadeOut(250);
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

    if ($("#countries:visible").length > 0) {

      if ($("body").hasClass("countries") && $("body").hasClass("index")) return;

      $("#countries").fadeOut(250);
      $(".countries_backdrop").fadeOut(250);
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
    addCircle("forest", "bars", { legendUnit: "m", countryCode: countryCode, width: 300, title: "Height", subtitle:"Tree height distribution", legend:"with {{n}} tall trees", hoverColor: "#333333", color: "#333333", unit: "km<sup>2</sup>" });
    addCircle("forma", "lines", { countryCode: countryCode, width: 300, title: "FORMA", subtitle:"Forest clearing alerts", legend:"In the last month", hoverColor: "#A1BA42", color: "#A1BA42" });
  }

});
