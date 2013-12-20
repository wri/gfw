//= require jquery
//= require jquery_ujs
//= require jquery-migrate-min
//= require jquery.easing.1.3
//= require jquery-ui-1.9.2.custom.min
//= require wax.g.min
//= require cartodb-gmapsv3
//= require cartodb-infowindow-min
//= require protected-infowindow-min
//= require imgLiquid.min
//= require lodash.min
//= require backbone-min
//= require class
//= require backbone.cartodb
//= require d3.v3.min
//= require topojson.v1.min
//= require geojson
//= require jquery.tipsy
//= require jquery.fileupload
//= require jquery.fileupload-ui
//= require jquery.fileupload-fp
//= require markerclusterer_compiled
//= require jquery.mousewheel.min
//= require jquery.jscrollpane
//= require spin.min
//= require mustache
//= require minpubsub
//= require jquery.qtip.min.js

//= require gfw/index
//= require_tree .

// Map needs to be a global var or
// CapybaraHelpers#draw_polygon won't work

var loaded           = false,
    map              = null,
    previousState    = null,
    globalZindex     = 300,
    subscribeMap;
    GOD               = {},
    legend            = {},
    analysis          = {},
    Timeline          = {},
    TimelineNotPlayer = {},
    TimelineImazon    = {},
    wall              = {},
    sourceWindow      = {},
    gallery           = {},
    languageSelector  = {},
    layerSelector     = {},
    searchBox         = {},
    Infowindow        = {},
    dropdown          = {};

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

  $(".more_stories li").on("mouseleave", function(e) {
    var $this = $(this);
    $this.find(".infowindow").fadeOut(50);
  });

  $(".more_stories li").on("mouseenter", function(e) {
    var $this = $(this);
    $this.find(".infowindow").fadeIn(50);
  });

  $(".lang_selector a").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  Timeline = new gfw.ui.view.Timeline({
    container: $("#map")
  });
  publish('timeline:change_dates', Timeline._getDates());

  TimelineLoss = new gfw.ui.view.TimelineLoss({
    container: $("#map")
  });

  TimelineImazon = new gfw.ui.view.TimelineImazon({
    container: $("#map")
  });

  TimelineNotPlayer = new gfw.ui.view.TimelineNotPlayer({
    container: $("#map")
  });

  window.timeline = Timeline;
  window.timeline_loss = TimelineLoss;
  window.timelineNotPlayer = TimelineNotPlayer;
  window.timelineImazon = TimelineImazon;

  Circle.init();
  Filter.init();

  $(".scroll").jScrollPane();

  callback && callback();

}

/**
 * Executes an AJAX request and returns handle to resulting jqxhr object.
 *
 * Args:
 *   url: The URL endpoint.
 *   data: Object with parameters.
 *   callback: Object with a success and error function.
 */
function executeAjax(url, data, callback, type) {
  var jqxhr = null;
  var key = null;
  var val = null;

  type = type ? type : "GET";

  $.ajax({
    url: url,
    type: type,
    data: data,
    success: function(response) {
      if (callback) {
        callback.success(response);
      }
    },
    error: function(status, error) {
      if (callback) {
        callback.error(status, error);
      }
    },
    contentType: 'application/json',
    dataType: 'json'
  });
  return jqxhr;
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

  google.maps.event.addListener(map, 'click', function (ev) {
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
        //layerTable : 'layerinfo_minus_imazon', // TODO: change back to layerinfo when we have imazon
        layerTable : 'layerinfo_dev', // TODO: change back to layerinfo when we have imazon
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

  // Search box
  searchBox = new gfw.ui.view.SearchBox({ map: map });
  $("#map").append(searchBox.render());
  searchBox.setDraggable(true);

  searchBox.bind('goto', function(latlng, bounds) {
    map.setCenter(latlng);
    map.fitBounds(bounds);
  });
}

(function(window,undefined){

  if ($("body.countries").hasClass("index")) CountryMenu.drawCountries();

  if($("body.countries").hasClass("show")) {
    CountryFeed.getNews(countryCode);
    CountryFeed.getMongabayNews(countryKeyword);
    CountryMenu.drawCountry(countryCode);
    CountryMenu.drawForest(countryCode);
    CountryMenu.drawTenure(countryCode);
    CountryMenu.drawCircle("forest_loss", "bars", { iso: countryCode, title: "Forest Cover Loss", subtitle: "Data Options", dataset: "hansen_forest_loss" });
  }

  dropdown = $('.forma_dropdown-link').qtip({
    show: 'click',
    hide: {
      event: 'click unfocus'
    },
    content: {
      text: $('.forma_dropdown-menu')
    },
    position: {
      my: 'top right',
      at: 'bottom right',
      target: $('.forma_dropdown-link'),
      adjust: {
        x: 10
      }
    },
    style: {
      tip: {
        corner: 'top right',
        mimic: 'top center',
        border: 1,
        width: 10,
        height: 6
      }
    }
  });

  $(".forma_dropdown-link").on("click", function(e) {
    e.preventDefault();
  });

  $(".forma_dropdown-menu a").on("click", function(e) {
    e.preventDefault();

    var dataset = $(e.target).attr("data-slug"),
        title = $(e.target).text();

    var api = dropdown.qtip('api');

    api.hide();

    if(dataset === 'hansen_forest_gain') {
      CountryMenu.drawCircle("forest_loss", "comp", { iso: countryCode, title: title });
    } else {
      CountryMenu.drawCircle("forest_loss", "bars", { iso: countryCode, title: title, dataset: dataset });
    }
  });

  $(".signin a.login").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    wall.login();
  });

  $(".signin a.register").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    wall.register();
  });

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

    $("body").animate({ scrollTop: 0 }, 250, function() {
      analysis.startAnalyzing();
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

    $("header a.logo").css({
      'position': 'absolute',
      'top': '0',
      'left': '50%',
      'margin-left': '-470px'
    });
  });

  return false;

})(window);

$(function(){

  var resizePID;

  var Router = Backbone.Router.extend({

    routes: {
      "map":                              "map",
      "map/":                             "map",
      "map/:zoom/:lat/:lon":              "mapWithCoordinates",
      "map/:zoom/:lat/:lon/:iso":         "mapWithCoordinates",
      "map/:zoom/:lat/:lon/:iso/*layers": "mapWithCoordinates",
      "/":                                "home",
      "":                                 "home"
    },

    home: function(query, page) {
      loadGFW( function() {
        Navigation.showState("home");
      });
    },

    map: function() {
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

  $(".country-menu a").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    var el = $('[data-menu="'+$(e.target).attr("data-slug")+'"]');

    goTo(el);
  });

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

    if ($("#window:visible").length > 0) {
      $(".backdrop").hide();
    }
  }

  $(".backdrop").on("click", function(e) {
    $(".backdrop").fadeOut(250);
  });

  $(".close").on("click", function(e) {
    e.preventDefault();
    $(".backdrop").fadeOut(250);
  });

  // $(document).on("click", function(e) {
  //   hideOvers();
  // });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      hideOvers();
    } // esc
  });

  $(window).resize(function() {
    clearTimeout(resizePID);
    resizePID = setTimeout(function() { resizeWindow(); }, 100);
  });

  $(window).scroll(positionScroll);

  function resizeWindow(e) {
    if (showMap && wall.readCookie("pass") == 'ok') {
      if (GFW.app) GFW.app.open();
      Filter.calcFiltersPosition();
    }
  }

  function positionScroll() {
    if($("header").hasClass("stuck")) {
      // stuck logo to top of viewport
      if($(window).scrollTop() < 5) {
        $("header a.logo").css({
          "position": "absolute",
          "top": "0"
        });
      } else if($(window).scrollTop() >= 5 && $(window).scrollTop() <= 68) {
        $("header a.logo").css({
          "position": "fixed",
          "top": "0"
        });
      } else if($(window).scrollTop() > 68) {
        $("header a.logo").css({
          "position": "absolute",
          "top": "63px"
        });
      }
    }

    if($("body.countries").hasClass("show")) {
      if($(window).scrollTop() < $("section.state").offset().top) {
        $(".country-menu").css({
          "position": "absolute",
          "top": "0"
        });
      } else if($(window).scrollTop() >= $("section.state").offset().top && $(window).scrollTop() <= ($("section.conventions").offset().top - 48)) {
        $(".country-menu").css({
          "position": "fixed",
          "top": "0"
        });

        selectedSection();
      } else if($(window).scrollTop() > ($("section.conventions").offset().top - 48)) {
        $(".country-menu").css({
          "position": "absolute",
          "top": ($("section.conventions").offset().top - $("section.state").offset().top - 48)
        });

        selectedSection();
      }

      $("a.info").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var source = $(e.target).attr("data-source");

        sourceWindow.show(source).addScroll();
      });

      $(".close").on("click", function(e) {
        hideOvers();
      });

      $(".backdrop").on("click", function(e) {
        hideOvers();
      });
    }
  }

  function selectedSection() {
    _.each($(".details section[data-menu]"), function(section) {
      if($(window).scrollTop() >= $(".details section[data-menu='" + $(section).attr("data-menu") +"']").offset().top - 48) {
        $(".country-menu li").removeClass("selected");
        $(".country-menu li."+$(section).attr("data-menu")).addClass("selected");
        return;
      }
    });
  }

  function goTo($el, opt, callback) {
    if ($el) {
      var speed  = (opt && opt.speed)  || 400;
      var delay  = (opt && opt.delay)  || 100;
      var margin = (opt && opt.margin) || 0;

      $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);
      callback && callback();
    }
  }

  if ($("div[data-load]:visible").length > 0) {
    addCircle("forma", "lines", { countryCode: countryCode, width: 310, title:"Forest Clearing Alerts", subtitle: "Humid Tropics", legend:"In the last month", hoverColor: "#A1BA42", color: "#FF4D4D" });
  }


});
