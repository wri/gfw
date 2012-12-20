var SubscriptionMap = (function() {

  var
  $modal = $("#subscribe"),
  $input = $modal.find(".input-field"),
  subscribeMap,
  zoomInit              = false;

  var drawingManager;
  var selectedShape;
  var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
  var selectedColor;

  function clearSelection() {

    clearErrors();

    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape = null;
      drawingManager.path = null;
    }

  }

  function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(true);
    selectColor(shape.get('fillColor') || shape.get('strokeColor'));
  }

  function deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }

  function selectColor(color) {
    selectedColor = color;

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
  }

  function setSelectedShapeColor(color) {
    if (selectedShape) {
      if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
        selectedShape.set('strokeColor', color);
      } else {
        selectedShape.set('fillColor', color);
      }
    }
  }

  function clearEmailErrors() {
    $input.find(".icon.error").fadeOut(250);
    $input.removeClass("error");
    $input.find(".error_input_label").fadeOut(250);
    $input.find(".error_input_label").html("");
  }


  function clearMapErrors() {
    $modal.find(".error_box").fadeOut(250);
    $modal.find(".error_box").html("");
  }

  function clearErrors() {
    clearEmailErrors();
    clearMapErrors();
  }

  function initialize() {

    clearErrors();

    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.45,
      editable: true
    };

    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },

      polygonOptions: polyOptions,
      map: subscribeMap
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);
        drawingManager.path = e.overlay.getPath().getArray();

        $modal.find(".remove").fadeIn(250);
        drawingManager.setOptions({drawingControl: false});

        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;
        setSelection(newShape);
      }
    });

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(map, 'click', clearSelection);

  }

  function remove() {
    clearErrors();
    deleteSelectedShape();
    drawingManager.setOptions({ drawingControl: true });
    drawingManager.path = null;
    $modal.find(".remove").fadeOut(250);
  }

  function submit() {

    clearErrors();

    var error = false;

    if (!validateEmail($input.find("input").val())) {
      $input.addClass("error");
      $input.find(".icon.error").fadeIn(250);
      $input.find(".error_input_label").html("Please enter a valid email");
      $input.find(".error_input_label").fadeIn(250);

      error = true;
    }

    if (!drawingManager.path) {
      $modal.find(".error_box").html("Please, draw a polygon around the area you are interested in");
      $modal.find(".error_box").fadeIn(250);

      error = true;
    }

    if (error) return;

    var
    $map      = $("#subscribe_map"),
    $form     = $("#subscribe form");
    $the_geom = $form.find('#area_the_geom');

    $map.toggleClass('editing-mode');
    $the_geom.val(JSON.stringify({
      "type": "MultiPolygon",
      "coordinates": [
        [
          $.map(drawingManager.path, function(latlong, index) {
            return [[latlong.lng(), latlong.lat()]];
          })
        ]
      ]
    }));

    $.ajax({ type: 'POST', url: $form.attr('action'), data: $form.serialize(),

      dataType: 'json',
      success: function( data, status ){

        $form.find(".btn.create, .input-field").fadeOut(250, function() {

          $form.find(".input-field input").val("");

          $form.find(".btn.new").fadeIn(250);
          $form.find(".ok").fadeIn(250);

          $modal.find(".remove").fadeOut(250);
          deleteSelectedShape();
          clearSelection();

        });

      }

    })

  }

  function setupZoom() {
    if (zoomInit) return ;

    var overlayID =  document.getElementById("zoom_controls_subscribe");
    // zoomIn
    var zoomInControlDiv = document.createElement('DIV');
    overlayID.appendChild(zoomInControlDiv);

    var zoomInControl = new zoomIn(zoomInControlDiv, map);
    zoomInControlDiv.index = 1;

    // zoomOut
    var zoomOutControlDiv = document.createElement('DIV');
    overlayID.appendChild(zoomOutControlDiv);

    var zoomOutControl = new zoomOut(zoomOutControlDiv, map);
    zoomOutControlDiv.index = 2;
    zoomInit = true;
  }

  function zoomIn(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_in');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = subscribeMap.getZoom() + 1;
      if (zoom < 20) {
        subscribeMap.setZoom(zoom);
      }
    });
  }

  function zoomOut(controlDiv, map) {
    controlDiv.setAttribute('class', 'zoom_out');

    google.maps.event.addDomListener(controlDiv, 'mousedown', function() {
      var zoom = subscribeMap.getZoom() - 1;

      if (zoom > 2) {
        subscribeMap.setZoom(zoom);
      }

    });
  }

  function setupBindings() {

    $modal.find(".close_icon").off("click");
    $modal.find(".close_icon").on("click", function(e) {
      e.preventDefault();
      hide();
    });

    $modal.find(".map").off("click");
    $modal.find(".map").on("click", function(e) {
      clearMapErrors();
    });

    $modal.find(".input-field").off('click');
    $modal.find(".input-field").on("click", function(e) {
      clearEmailErrors();
    });

    $modal.find('.remove').off('click');
    $modal.find('.remove').on("click", function(e){
      e.preventDefault();
      remove();
    });

    $modal.find('.btn.new').off("click");
    $modal.find('.btn.new').on("click", function(e){
      e.preventDefault();
      restart();
    });

    $modal.find('.btn.create').off("click");
    $modal.find('.btn.create').on("click", function(e){
      e.preventDefault();
      submit();
    });

  }

  function hide() {
    $(".backdrop").fadeOut(250, function() {
      $(this).remove();
    });

    $modal.fadeOut(250, function() {
      clearErrors();
      $input.find("input").val("");
      clearSelection();
    });
  }

  function restart() {
    var $form     = $("#subscribe form");
    $form.find(".ok").fadeOut(250);
    $modal.find(".remove").fadeOut(250);
    $form.find(".btn.new").fadeOut(250);
    $form.find(".btn.create").fadeIn(250);
    $form.find(".input-field input").val("");
    $form.find(".input-field").fadeIn(250);
    deleteSelectedShape();
    clearSelection();
    initialize();
  }

  function show() {

    $modal.find(".ok").hide();
    $modal.find(".btn.create").show();
    $modal.find(".input-field").show();
    $modal.find(".btn.new").hide();
    $modal.find(".remove").hide();

    $("#content").append('<div class="backdrop" />');
    $(".backdrop").fadeIn(250, function() {

      var $map = $("#subscribe_map");

      $modal.css({ opacity: '0', display: 'block' });
      $modal.stop().animate({opacity: '1'}, 250, function(){

        var mapOptions = {
          zoom:               1,
          minZoom:            config.MINZOOM,
          maxZoom:            config.MAXZOOM,
          center:             new google.maps.LatLng(32.39851580247402, -35.859375),
          mapTypeId:          google.maps.MapTypeId.TERRAIN,
          disableDefaultUI:   true,
          panControl:         false,
          zoomControl:        false,
          mapTypeControl:     false,
          scaleControl:       false,
          streetViewControl:  false,
          overviewMapControl: false,
          scrollwheel:        false
        };

        // Initialise the google map
        subscribeMap = new google.maps.Map(document.getElementById("subscribe_map"), mapOptions);
        initialize();

        setupBindings();
        setupZoom();

      });
    });
  }

  return {
    show: show,
    remove: remove,
    submit: submit,
    clearEmailErrors: clearEmailErrors,
    clearMapErrors: clearMapErrors
  };

}());

var Navigation = (function() {

  var
  mapAnimationPID      = null,
  mapAnimationInterval = 50;

  function _select(name) {
    $("nav li a").removeClass("selected");
    $("nav ." + name).addClass("selected");
  }

  function _showState(state) {
    if (state === 'home') {
      _showHomeState();
    } else if (state === "map") {
      _showMapState();
    }
  }

  var lastCountryClass;
  if ($('body').find("#countries").length>0) {
    $.ajax({
      async: true,
      dataType: "jsonp",
      jsonpCallback:'iwcallback',
      url: "http://wri-01.cartodb.com/api/v2/sql?q=SELECT sum(alerts) as alerts, iso FROM gfw2_forma_graphs WHERE date > (SELECT n  FROM gfw2_forma_datecode WHERE now() -INTERVAL '6 months' < date ORDER BY date ASC LIMIT 1) group by iso;",
      success: function(data) {
        for (var i = 0; i<data.rows.length; i++){
          $("#countries ."+data.rows[i].iso+" .content strong").html(data.rows[i].alerts);
        }
      }
    });
  }
  $("#countries .disabled").on("mouseenter", function() {
    $(".select").hide();
  });

  $("#countries h1").on("mouseenter", function() {
    $(".select").hide();
  });

  $("#countries").on("mouseleave", function() {
    $(".select").hide();
  });

  $("#countries .country").on("mouseenter", function() {

    if ($(this).hasClass("disabled")) {
      return;
    }

    var // selection box dimensions
    h = $("#countries .select").height(),
    w = $("#countries .select").width();

    var top = $(this).position().top - (h/2 - $(this).height()/2);
    var left = $(this).position().left - (w/2 - $(this).width()/2);

    $("#countries .select").css({ top: top , left: left });
    var c = $(this).attr("class").replace(/country/, "");

    if (lastCountryClass) {
      $("#countries .select").removeClass(lastCountryClass);
    }

    $("#countries .select").addClass(c);
    lastCountryClass = c;
    $("#countries .select").html($(this).html());
    $("#countries .select").show();
  });

  function _showHomeState() {
    showMap = false;

    _hideOverlays();

    legend.hide();
    layerSelector.hide();

    Navigation.select("home");

    Filter.hide(function() {

      $("header").animate({ height: "247px" }, 250, function() {
        $("hgroup h1").animate({ top: 29, opacity: 1 }, 250);
      });

      $(".big_numbers").fadeIn(250);
    });

    this.time_layer.cache_time(true);
    Timeline.hide();
    self.time_layer.set_time(128);

    _animateMap();

    GFW.app.close(function() {
      Circle.show(250);
      //$("footer, .actions").fadeIn(250);
    });
  }

  function _animateMap() {
    if (typeof skipMapAnimation != "undefined" && skipMapAnimation) {
      return;
    }
    mapAnimationPID = setInterval(function() {
      map.panBy(-1, 0);
    }, mapAnimationInterval);
  }

  function _stopMapAnimation() {
    clearInterval(mapAnimationPID);
  }

  function _hideOverlays() {
    $("#subscribe").fadeOut(250);
    $("#share").fadeOut(250);
    $(".backdrop").fadeOut(250);
    $("#countries").fadeOut(250);
  }

  function _showMapState() {
    showMap = true;

    _hideOverlays();

    Navigation.select("map");

    Circle.hide();

    layerSelector.show();
    legend.show();

    _stopMapAnimation();

    self.time_layer.set_time(self.time_layer.cache_time());
    Timeline.show(); // TODO: don't show the timeline if FORMA is not selected

    $(".big_numbers").fadeOut(250);

    $("header").animate({height: "150px"}, 250, function() {
      GFW.app.open();
    });

    $("hgroup h1").animate({ top: "50px", opacity: 0 }, 250, function() {
      Filter.show();
      $(".big_numbers").fadeOut(250);
    });
  }

  // Init method
  $(function() {
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
  }());

  return {
    select: _select,
    showState: _showState,
    animateMap: _animateMap,
    stopMapAnimation: _stopMapAnimation,
    hideOverlays: _hideOverlays
  };

}());

var Filter = (function() {

  var
  scrollPane,
  pids,
  filters    = [],
  lastClass  =  null,
  categories = [],
  $filters   = $(".filters"),
  $advance   = $filters.find(".advance"),
  $layer     = $("#layer");


  function _updateHash(id, visible) {

    var zoom = map.getZoom();
    var lat  = map.getCenter().lat().toFixed(2);
    var lng  = map.getCenter().lng().toFixed(2);

    var hash = "/map/" + zoom + "/" + lat + "/" + lng + "/" + filters.join(",");

    History.pushState({ state: 3 }, "Map", hash);
  }

  function _toggle(id) {
    if (_.include(filters, id)) {
      filters = _.without(filters, id);
    } else {
      filters.push(id);
    }
    _updateHash(id);
  }

  function _show(callback) {

    if (!$filters.hasClass("hide")) return;

    var count = categories.length;

    $filters.fadeIn(150, function() {

      $filters.find("li").slice(0, count).each(function(i, el) {
        $(el).delay(i * 50).animate({ opacity: 1 }, 150, "easeInExpo", function() {
          $(this).find("a").animate({ top: "-15px"}, 150);
          count--;

          if (count <= 0) {

            if (categories.length > 7) { // TODO: calc this number dynamically
              $advance.delay(200).animate({ top: "20px", opacity: 1 }, 200);
            }

            $filters.removeClass("hide");

            $filters.find("li").css({opacity:1});
            $filters.find("li a").css({top:"-15px"});

            if (callback) callback();
            _calcFiltersPosition();
          }
        });
      });
    });
  }

  function _hide(callback) {

    _hideLayer();

    if ($filters.hasClass("hide")) return;

    var count = categories.length;

    $advance.animate({ top: "40px", opacity: 0 }, 200, function() {

      $($filters.find("li a").slice(0, count).get().reverse()).each(function(i, el) {

        $(el).delay(i * 50).animate({ top: "15px" }, 150, function() {
          $(this).parent().animate({ opacity: "0"}, 150, function() {

            --count;

            if (count <= 0) {
              $filters.fadeOut(150, function() {
                $filters.addClass("hide");

                $filters.find("li a").css({top:"15px"});
                $filters.find("li").css({opacity:0});

                if (callback) callback();
              });
            }
          });
        });
      });
    });
  }

  function _calcFiltersPosition() {
    $filters.find("li").each(function(i, el) {
      $(el).data("left-pos", $(el).offset().left);
    });
  }

  function _advanceFilter(e) {
    e.preventDefault();

    _closeOpenFilter();

    var
    $inner = $filters.find(".inner"),
    $el    = $inner.find("li:first"),
    width  = $el.width() + 1;

    $filters.find(".inner").animate({ left:"-=" + width }, 250, "easeInExpo", function() {
      $(this).find('li:last').after($el);
      $(this).css("left", 0);

      _calcFiltersPosition();
    });
  }

  function _hideLayer() {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css("left", -10000);
    });
  }

  function _closeOpenFilter() {
    var c = $layer.attr("class");

    if (c === undefined) return;

    clearTimeout(pids);

    pids = setTimeout(function() {
      _close(c);
    }, 100);
  }

  function _close(c) {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css("left", -10000);
      $layer.removeClass(c);
    });
  }

  function _open() {

    var
    $li          = $(this),
    lw           = $layer.width(),
    liClass      = $li.attr("data-id"),
    l            = $li.data("left-pos"),
    $line        = $li.find(".line"),
    lineWidth    = $line.width();

    cancelClose();

    $layer.removeClass(lastClass);

    var name = $li.find("a").text();
    $layer.find("a.title").text(name);

    $layer.find(".links li.last").removeClass('last');
    $layer.find(".links li").hide();
    $layer.find(".links li." + liClass).show();
    $layer.find(".links li." + liClass).last().addClass("last");

    $layer.addClass(liClass);

    lastClass = liClass;

    var
    width  = $li.width() < 170 ? 170 : $li.width(),
    left   = (l + $li.width() / 2) - (width / 2),
    height = $layer.find(".links").height() ;

    $layer.find("li").css({ width:width - 20});
    $layer.css({ left: left, width:width, top: -80});
    console.log(height);
    if (height < 200) {
      $(".scroll").css({ height: height });
    } else $(".scroll").css({ height: 200 });
    $layer.animate({ opacity: 1 }, 250);

    var
    l     = $layer.find(".links li." + liClass).length,
    $pane = $layer.find(".scroll");

    if (scrollPane) {
      scrollPane.reinitialise();
    } else {
      $pane.jScrollPane( { showArrows: true });
      scrollPane = $pane.data('jsp');
    }
    window.scrollPane = scrollPane;

  }

  function cancelClose() {
    clearTimeout(pids);
  }

  function _onMouseEnter() {
    $layer.animate({ opacity: 1 }, 150);
  }


  function _nothing() {

  }

  function _init() {

    // Bindings
    $(document).on("click", ".filters .advance", _advanceFilter);
    $(document).on("mouseenter", ".filters li", _open);
    $layer.on("mouseleave", _closeOpenFilter);
  }

  function _check(id) {
    $("#layer a[data-id=" + id +"]").addClass("checked");
    filters.push(id);
  }

  function _addFilter(id, slug, category, name, options) {

    var
    zoomEvent  = options.zoomEvent  || null,
    clickEvent = options.clickEvent || null,
    disabled   = options.disabled   || false;
    source     = options.source     || null;

    if (category === null || !category) {
      category = 'Protected Areas';
    }

    var cat  = category.replace(/ /g, "_").toLowerCase();

    if (!_.include(categories, cat)) {
      var
      template = _.template($("#filter-template").html()),
      $filter  = $(template({ name: category, category: cat, data: cat }));

      $filters.find("ul").append($filter);
      categories.push(cat);
    }

    var
    layerItemTemplate = null,
    $layerItem        = null;

    // Select the kind of input (radio or checkbox) depending on the category
    if (cat === 'forest_clearing') {

      layerItemTemplate = _.template($("#layer-item-radio-template").html());
      $layerItem = $(layerItemTemplate({ name: name, id: id, category: cat, disabled: disabled, source: source }));

      if (!disabled) { // click binding
        $layerItem.find("a:not(.source)").on("click", function() {
          if (!$(this).find(".radio").hasClass("checked")) {
            clickEvent();
            zoomEvent();
          }
        });
      }

    } else {
      layerItemTemplate = _.template($("#layer-item-checkbox-template").html());
      $layerItem = $(layerItemTemplate({ name: name, id: id, category: cat, disabled: disabled, source: source }));

      if (!disabled) { // click binding
        $layerItem.find("a:not(.source)").on("click", function() {
          clickEvent();
          zoomEvent();
        });
      }

    }

    $layer.find(".links").append($layerItem);
    $layerItem.find(".checkbox").addClass(cat);

    // We select the FORMA layer by default
    if ( slug == "semi_monthly" ) {
      $layerItem.find(".radio").addClass('checked');
    }
  }

  return {
    init: _init,
    show: _show,
    hide: _hide,
    addFilter: _addFilter,
    toggle: _toggle,
    closeOpenFilter:_closeOpenFilter,
    calcFiltersPosition: _calcFiltersPosition,
    check: _check
  };

}());

var Circle = (function() {

  var template, $circle, $title, $counter, $background, $explore, animating = true, animatingB = false, circlePID;

  function toggleData() {
    var data = {};

    if ($icon.hasClass("area")) {
      data = flagSummary;
      $icon.removeClass("area");
    } else {
      data = areaSummary;
      $icon.removeClass("flag");
    }

    $icon.addClass(data.icon);
    $title.html(data.title);
    $counter.html(data.count);

  }

  function _build(){

    if ( $("#circle-template").length > 0 ) {

      template    = _.template($("#circle-template").html());
      $circle     = $(template(flagSummary));

      $title      = $circle.find(".title");
      $icon       = $circle.find(".icon");
      $counter    = $circle.find(".counter");
      $background = $circle.find(".background");
      $explore    = $circle.find(".explore");

      $("#map").append($circle);

      circlePID = _startAnimation();

      return true;
    }

    return false;
  }

  function _startAnimation() {
    return setInterval(function() {
      _next();
    }, 5000);
  }

  function _next() {

    if (animatingB) return;
    animatingB = true;

    $icon.animate({ backgroundSize: "10%", opacity: 0 }, 250, "easeOutExpo", function() {
      $circle.delay(200).animate({ marginLeft: -350, opacity: 0 }, 350, "easeOutQuad", function() {
        $circle.css({marginLeft: 100 });
        toggleData();
        $circle.delay(400).animate({ marginLeft: -1*318/2, opacity: 1 }, 250, "easeOutQuad", function() {
        $icon.animate({ backgroundSize: "100%", opacity: 1 }, 250, "easeInExpo");
          animatingB = false;
        });
      });
    });

  }

  function _show(delay) {

    if (!delay) {
      delay = 0;
    }

    var $circle = $(".circle");

    $circle.show();

    $circle.delay(delay).animate({ top:'50%', marginTop:-1*($circle.height() / 2), opacity: 1 }, 250, function() {
      $title.animate({ opacity: 0.75 }, 150, "easeInExpo");

      $icon.animate({ backgroundSize: "100%", opacity: 1 }, 350, "easeInExpo");

      $counter.animate({ opacity: 1 }, 150, "easeInExpo");
      animating = false;

      _onMouseLeave();

    });
  }

  function _onMouseEnter() {

    clearInterval(circlePID);
    if (animating) return;

    var $circle = $(".circle");

    $circle.find(".title, .counter").stop().animate({ opacity: 0 }, 100, "easeInExpo", function() {
      $circle.find(".explore, .background").stop().animate({ opacity: 1 }, 100, "easeOutExpo");
      $icon.stop().animate({ backgroundSize: "10%", opacity: 0 }, 200, "easeInExpo");
      $circle.addClass("selected");
    });
  }

  function _onMouseLeave() {

    clearInterval(circlePID);
    circlePID = _startAnimation();

    if (animating) return;


    $circle.find(".explore, .background").stop().animate({ opacity: 0 }, 100, "easeOutExpo", function(){
      $title.animate({ opacity: 0.75 }, 100, "easeOutExpo");
      $counter.animate({ opacity: 1 }, 100, "easeOutExpo");
      $icon.stop().animate({ backgroundSize: "100%", opacity: 1 }, 200, "easeOutExpo");
      $circle.removeClass("selected");
    });
  }

  function _hide(e) {
    if (e) {
      e.preventDefault();
    }

    animating = true;

    var _afterHide = function() {
      $circle.animate({ marginTop:0, opacity: 0 }, 250, function() {
        $(this).hide();
      });
    };

    if ($circle) {
      $circle.find(".title, .counter").animate({ opacity: 0 }, 150, "easeOutExpo", _afterHide);
    }
  }

  function _onClick(e) {
    if (e) {
      e.preventDefault();
    }

    History.pushState({ state: 1 }, "Map", "/map");
  }

  function _init() {
    if (_build()) {

      // Bindings
      $circle.die("click");
      $circle.die("mouseenter");
      $circle.die("mouseleave");

      $circle.on("click", _onClick);
      $circle.on("mouseenter", _onMouseEnter);
      $circle.on("mouseleave", _onMouseLeave);

    }
  }

  return {
    init: _init,
    show: _show,
    hide: _hide
  };

})();

var Timeline = (function() {

  var
  $timeline      = $(".timeline"),
  $handle        = $timeline.find(".handle"),
  $coordinates   = $timeline.find(".coordinates"),
  $play          = $timeline.find(".handle .play"),
  animationPid   = null,
  animationDelay = 500,
  animationSpeed = 120,
  step           = 8, // distance between the points/months
  advance        = step + "px",
  playing        = false,
  instance       = null,
  dates = [
    [0,   86, 2006],
    [94, 118, null],
    [126, 214, 2007],
    [222, 246, null],
    [254, 342, 2008],
    [350, 376, null],
    [384, 470, 2009],
    [478, 502, null],
    [510, 600, 2010],
    [606, 632, null],
    [640, 728, 2011],
    [736, 760, null],
    [768, 832, 2012],
    [840, 856, null]
  ];

  function _togglePlayState() {
    $play.fadeOut(100, "easeOutExpo", function() {
      $(this).toggleClass("playing");
      $(this).fadeIn(100, "easeInExpo");
    });
  }

  function _play(e) {
    if (e) {
      e.preventDefault();
    }

    playing = !playing;

    if ($handle.position().left >= dates[dates.length - 1][1]) {
      playing = false;

      // Fake toggle
      $play.fadeOut(100, "easeOutExpo", function() {
        $(this).fadeIn(100, "easeInExpo");
      });

    } else {
      _togglePlayState();
    }

    if (playing) {
      advance = step + "px";
      _animate();
    } else {
      _stopAnimation(true);
    }
  }

  function _stopAnimation(animated) {
    advance = "0";
    playing = false;
    clearTimeout(animationPid);

    if (animated) {
      $play.fadeOut(100, "easeOutExpo", function() {
        $(this).removeClass("playing");
        $(this).fadeIn(100, "easeInExpo");
      });
    } else {
      $play.removeClass("playing");
    }
  }

  function _animate() {

    if (!playing) return;

    clearTimeout(animationPid);

    animationPid = setTimeout(function() {

      $handle.animate({ left: "+=" + advance }, animationSpeed, "easeInExpo", function() {

        if ($handle.position().left >= dates[dates.length - 1][1] || $handle.position().left == dates[dates.length - 1][0] ) {
          _stopAnimation(true);
          _setDate($handle.position().left);
        }

        if (!playing) return;

        _setDate($handle.position().left);
        _animate();
      });

    }, animationDelay);
  }

  function _gotoDate(e) {
    e.preventDefault();
    e.stopPropagation();

    if ($(this).parent().hasClass("disabled")) return;

    var
    year     = parseInt($(this).text(), 10),
    lastYear = parseInt($timeline.find(".years li:last-child a").text(), 10);

    // if the user clicked on the last year of the timeline
    if (year === lastYear) {
      var pos = dates[ dates.length - 1 ][1];

      $handle.animate({ left: pos }, 150, "easeOutExpo");
      _changeDate(pos, dates[ dates.length - 1 ]);

      return;
    }

    // if the user clicked on another year
    _.each(dates, function(date, j) {

      if (date[2] === year) {
        var pos = date[0];

        $handle.animate({ left: pos }, 150, "easeOutExpo");
        _changeDate(pos, date);
        return;
      }

    });
  }

  function _changeDate(pos, date) {
    var
    monthPos = Math.round( ( -1 * date[0] + pos) / step),
    month    = config.MONTHNAMES_SHORT[monthPos];

    $handle.find("div").html("<strong>" + month + "</strong> " + date[2]);

    // year 2000 is base year
    instance.trigger('change_date', date, monthPos + (date[2] - 2000)*12);
  }

  function _updateCoordinates(latLng) {

    var lat = parseFloat(latLng.lat());
    var lng = parseFloat(latLng.lng());

    lat = lat.toFixed(2);
    lng = lng.toFixed(2);

    $coordinates.html(lat + ", " + lng);

  }

  function _setDate(pos, stop) {
    _.each(dates, function(date, j) {

      if (pos >= date[0] && pos <= date[1]) {


        if ( date[2] ) {

          _changeDate(pos, date);

        } else {

          var
          newDate     = (dates[ j + 1 ]) ? dates[ j + 1 ] : dates[ j - 1 ],
          newPosition = (dates[ j + 1 ]) ? newDate[0] : newDate[1];

          $handle.css("left", newPosition);
          _changeDate(newPosition, newDate);
        }

        return;
      }
    });
  }

  function _show() {

    if (_isHidden()) {
      $timeline.removeClass("hidden");
      $timeline.animate({ bottom: parseInt($timeline.css("bottom"), 10) + 20, opacity: 1 }, 150, _afterShow);
    }

  }

  function _hide() {

    if (!_isHidden()) {
      $handle.fadeOut(250, function() {
        $timeline.animate({ bottom: parseInt($timeline.css("bottom"), 10) - 20, opacity: 0 }, 150, _afterHide);
      });
    }

  }

  function _afterShow() {
    $handle.delay(250).fadeIn(250);
  }

  function _afterHide() {
    $timeline.addClass("hidden");
  }

  function _isHidden() {
    return $timeline.hasClass("hidden");
  }

  /*
  * Init function
  **/
  function _init() {

    // Bindings
    $timeline.find(".years a").on("click", _gotoDate);
    $timeline.find(".play").on("click", _play);

    $handle.draggable({
      containment: "parent",
      grid: [8, 0],
      axis: "x",
      drag: function() {
        var left = $(this).position().left;
        _setDate(left);

        if (playing) {
          _stopAnimation(false);
        }
      },
      stop: function() {
        var left = $(this).position().left;
        _setDate(left, true);
      }
    });
  }

  // hack, sorry arce
  // create a temporally object to give Backbone.Events features
  // see _changeDate
  function obj() {}
  _.extend(obj.prototype, Backbone.Events);
  instance = new obj();
  _.extend(instance, {
    init: _init,
    hide: _hide,
    show: _show,
    updateCoordinates: _updateCoordinates,
    isHidden: _isHidden
  });
  return instance;

})();






function updateFeed(options) {
  var
  countryCode       = options.countryCode || 'MYS',
  n                 = options.n || 4;
  var url = "https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20to_char(gfw2_forma_datecode.date,%20'dd,%20FMMonth,%20yyyy')%20as%20date,alerts%20FROM%20gfw2_forma_graphs,gfw2_forma_datecode%20WHERE%20gfw2_forma_datecode.n%20=%20gfw2_forma_graphs.date%20AND%20iso%20=%20'"+countryCode+"'%20order%20by%20gfw2_forma_datecode.date%20desc%20LIMIT%20"+n;
  $.ajax({
    dataType: "jsonp",
    jsonpCallback:'iwcallback',
    url: url,
    success: function(json) {
      if (0<json.rows.length){
        $('.alerts ul').html("");
      }
      for (var i=0; i<json.rows.length; i++){
        $('.alerts ul').append(
          $('<li></li>')
          .append(
            $('<span></span>').addClass('data').html(json.rows[i].date))
            .append(
              $('<span></span>').addClass('count').html(json.rows[i].alerts+' Alerts'))
        );
      }
    }
  });
}


function addCircle(id, type, options) {

  var
  countryCode       = options.countryCode || 'MYS',
  width             = options.width      || 300,
  height            = options.height     || width,
  barWidth          = options.barWidth   || 5,
  title             = options.title      || "",
  subtitle          = options.subtitle   || "",
  legend            = options.legend     || "",
  h                 = 100, // maxHeight
  legendUnit        = options.legendUnit || "",
  unit              = options.unit       || "",
  color             = options.color      || "#333333",
  hoverColor        = options.hoverColor || "#111111",
  radius            = width / 2,
  mouseOverDuration = 10,
  mouseOutDuration  = 700;

  var graph = d3.select(".circle." + type)
  .append("svg:svg")
  .attr("class", id)
  .attr("width", width)
  .attr("height", height);

  var dashedLines = [
    { x1:45, y:height/4,   x2:270,   color: "#ccc" },
    { x1:2,  y:height/2,   x2:width, color: "#ccc" },
    { x1:45, y:3*height/4, x2:270,   color: "#ccc" }
  ];

  // Adds the dotted lines
  _.each(dashedLines, function(line) {
    graph.append("svg:line")
    .attr("x1", line.x1)
    .attr("y1", line.y)
    .attr("x2", line.x2)
    .attr("y2", line.y)
    .style("stroke-dasharray", "2,2")
    .style("stroke", line.color);
  });

  // Internal circle
  graph.append("circle")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", color)
  .attr("r", function(d) { return radius - 15.5; })
  .attr("transform", "translate(" + radius + "," + radius + ")");

  // External circle
  graph.append("circle")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "white")
  .attr("r", function(d) { return radius - 5.5; })
  .attr("transform", "translate(" + radius + "," + radius + ")")
  .on("mouseout", function(d) {
  });

  function addText(opt) {

    //if (typeof SVGForeignObjectElement !== 'undefined')  {
    graph.append("foreignObject")
    .attr('x', opt.x)
    .attr('y', opt.y)
    .attr('width', opt.width)
    .attr('height', opt.height)
    .attr('class', opt.c)
    .append("xhtml:div")
    .html(opt.html)

  }

  // Content selection: lines or bars
  if (type == 'lines') {

    $.ajax({
      async: true,
      dataType: "jsonp",
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT date_part('year',gfw2_forma_datecode.date) as y, date_part('month',gfw2_forma_datecode.date) as m,alerts FROM gfw2_forma_graphs,gfw2_forma_datecode WHERE  71<gfw2_forma_datecode.n AND gfw2_forma_datecode.n = gfw2_forma_graphs.date AND iso = '" + countryCode + "' order by gfw2_forma_datecode.date asc",
      success: function(json) {


        var data = json.rows.slice(1, json.rows.length);
        var x = d3.scale.linear()
        .domain([0, data.length - 1])
        .range([0, width - 80]);

        var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.alerts})])
        .range([0, h]);

        var line = d3.svg.line()
        .x(function(d,i)  { return x(i); })
        .y(function(d, i) { return h-y(d.alerts); })
        .interpolate("basis");

        // Adds the line graph
        var marginLeft = 40;
        var marginTop = radius - h/2;

        var p = graph.append("svg:path")
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .attr("d", line(data))
        .on("mousemove", function(d) {

          var index = Math.round(x.invert(d3.mouse(this)[0]));

          if (data[index]) { // if there's data
            var val = data[index].alerts + " <small>" + unit + "</small>";
            $(".amount." + id + " .text").html(val);

            var date = new Date(data[index].y, data[index].m);
            months = monthDiff(date, new Date());

            if (months === 0) {
              val = "in this month";
            } else if (months == 1) {
              val = "in the last month";
            } else {
              val = "in " + config.MONTHNAMES[data[index].m - 1] + " " + data[index].y;
            }

            $(".graph_legend." + id + " .text").html(val);

            d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);

            var cx = d3.mouse(this)[0]+marginLeft;
            var cy = h-y(data[index].alerts)+marginTop;

            graph.select("#marker")
            .attr("cx",cx)
            .attr("cy",cy)
          }
        })

        graph.append("circle")
        .attr("id", "marker")
        .attr("cx", -10000)
        .attr("cy",100)
        .attr("r", 5);
      }
    });


  } else if (type == 'bars') {

    $.ajax({
      async: true,
      dataType: "jsonp",
      url: "https://wri-01.cartodb.com/api/v2/sql?q=SELECT area_sqkm,height_m FROM gfw2_forest_heights WHERE iso = '"+ countryCode +"' ORDER BY height_m ASC",
      success: function(json) {

        var data = json.rows;

        var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, barWidth]);

        var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.area_sqkm})])
        .rangeRound([0, h]); //rangeRound is used for antialiasing

        var marginLeft = width/2 - data.length * barWidth/2;
        var marginTop = height/2 - h/2;

        graph.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("x", function(d, i) { return x(i) - .5; })
        .attr("y", function(d) {
          var l = y(d.area_sqkm);
          if (l<3) l = 3;
          return h - l - .3; }
        )
        .attr("width", barWidth)
        .attr("height", function(d) {
          var l = y(d.area_sqkm);
          if (l<3) l = 3;
          return l; }
        )
        .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
        .on("mouseover", function(d) {

          var val = Math.floor(d.area_sqkm) + " <small>" + unit + "</small>";
          $(".amount." + id + " .text").html(val);

          var t = _.template(legend);
          val = t({ n: Math.floor(d.height_m) + legendUnit });
          $(".graph_legend." + id + " .text").html(val);

          d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);
        })
        .on("mouseout", function() { d3.select(this).transition().duration(mouseOutDuration).style("fill", color); })
      }
    });

  }

  // Adds texts

  if (title) {
    addText({ x: 0, y: 40, width: width, height: 50, c:"title", html: '<div class="text">' + title + '</div>' });
  }

  if (subtitle) {
    addText({ x: 0, y: height/4 - 10, width: width, height: 50, c:"subtitle", html: '<div class="text">' + subtitle + '</div>' });
  }

  addText({ x: 0, y: 3*height/4 - 13, width: width, height: 50, c:"amount " + id, html: '<div class="text"></div>' });

  if (legend) {
    addText({ x: 0, y: 3*height/4 + 15, width: width, height: 50, c:"graph_legend " + id, html: '<div class="text"></div>' });
  }
}

