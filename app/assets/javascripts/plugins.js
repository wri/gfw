var Navigation = (function() {

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

  function _showHomeState() {
    showMap = false;

    Infowindow.hide();
    Navigation.select("home");

    Filter.hide(function() {
      $("hgroup h1").animate({ top: 0, opacity: 1 }, 250);
    });

    Timeline.hide();

    GFW.app.close(function() {
      Circle.show(250);
      $("footer, .actions").fadeIn(250);
    });
  }

  function _showMapState() {
    showMap = true;

    Navigation.select("map");

    Circle.hide();

    //if ($.jStorage.get("forma") == true) {
      Timeline.show();
    //}

    GFW.app.open();

    $("footer, .actions").fadeOut(250);

    $("hgroup h1").animate({ top: "50px", opacity: 0 }, 250, function() {
      Filter.show();
    });
  }

  return {
    select: _select,
    showState: _showState
  };

}());

var Filter = (function() {

  var
  lastClass = null,
  pids,
  categories = [],
  $filters   = $(".filters"),
  $advance   = $filters.find(".advance"),
  $layer     = $("#layer");

  function _show(callback) {

    if (!$filters.hasClass("hide")) return;

    var count = categories.length;

    $filters.fadeIn(150, function() {

      $filters.find("li").slice(0, count).each(function(i, el) {
        $(el).delay(i * 50).animate({ opacity: 1 }, 150, "easeInExpo", function() {
          $(this).find("a").animate({ top: "-15px"}, 150);
          count--;

          if (count <= 0) {

            if (categories.length > 5) { // TODO: calc this number dynamically
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
    $layer.animate({ opacity: 0 }, 150, function() {
      $layer.css("left", -10000);
    });
  }

  function _closeOpenFilter() {
    var c = $layer.attr("class");

    if (c === undefined) return;

    pids = setTimeout(function() {
      _close(c);
    }, 100);
  }

  function _close(c) {
    $layer.animate({ opacity: 0 }, 150, function() {
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

    var width = $li.width() < 159 ? 159 : $li.width();
    var left  = (l + $li.width() / 2) - (width / 2);

    $layer.find("li").css({ width:width - 20});
    $layer.css({ left: left, width:width, height: $layer.find(".links").height() + 90, top: -80});
    $layer.animate({ opacity: 1 }, 250);
  }

  function cancelClose() {
    clearTimeout(pids);
  }

  function _onMouseEnter() {
    $layer.animate({ opacity: 1 }, 150);
  }

  function _init() {

    // Bindings
    $(document).on("click", ".filters .advance", _advanceFilter);
    $(document).on("mouseenter", ".filters li", _open);
    $layer.on("mouseleave", _closeOpenFilter);
  }

  function _addFilter(category, name, clickEvent, zoomEvent) {

    if (category === null || !category) {
      category = 'Other layers';
    }

    var
    cat = category.replace(/ /g, "_").toLowerCase(),
    id  = name.replace(/ /g, "_").toLowerCase();

    if (!_.include(categories, cat)) {
      var
      template = _.template($("#filter-template").html()),
      $filter  = $(template({ name: category, c: cat, data: cat }));

      $filters.find("ul").append($filter);
      categories.push(cat);
    }

    var
    layerItemTemplate = null,
    $layerItem        = null;

    /*if (cat === 'deforestation') {
      layerItemTemplate = _.template($("#layer-item-radio-template").html());
      $layerItem = $(layerItemTemplate({ name: name.truncate(15), c: cat }));
    } else {*/
      layerItemTemplate = _.template($("#layer-item-checkbox-template").html());
      $layerItem = $(layerItemTemplate({ name: name.truncate(15), c: cat }));
    //}

    $layer.find(".links").append($layerItem);
    $layerItem.find(".checkbox").addClass(cat);

    $layerItem.on("click", function() {
      clickEvent();
      zoomEvent();
    });

    if ( name == "FORMA") {
      $layerItem.find(".checkbox").addClass('checked');
      Infowindow.add(name, category);

    }

    /*if ($.jStorage.get(id) == true) {
      $layerItem.find(".checkbox").addClass('checked');
      clickEvent();
    }*/
  }


  return {
    init: _init,
    show: _show,
    hide: _hide,
    addFilter: _addFilter,
    closeOpenFilter:_closeOpenFilter
  };

}());

var Infowindow = (function() {

  var
  template,
  $infowindow;

  function _init() {

    if (_build()) {

      // Makes it draggable
      $infowindow.draggable({
        containment: "#map-container .map",
        handle: ".header",
        stop: function() {
          $.jStorage.set("infowindow", [$infowindow.offset().top, $infowindow.offset().left]);
        }
      });

      // Adds close binding
      $infowindow.find(".close").on("click", _hide);
    }

  }

  function _build() {

    if ( $("#infowindow-template").length > 0 ) {

      template    = _.template($("#infowindow-template").html());
      $infowindow = $(template({ layers: "" }));

      var position = $.jStorage.get("infowindow");

      if (position) {
        $infowindow.css({ top: position[0], left: position[1], opacity:0 });
      }

      $("#content").append($infowindow);

      return true;
    }

    return false;
  }

  function _add(name, category) {

    if (category === null || !category) {
      category = 'Other layers';
    }

    var
    id = name.replace(/ /g, "_").toLowerCase(),
    cat = category.replace(/ /g, "_").toLowerCase();

    template = _.template($("#infowindow-item-template").html());
    $item    = $(template({ c: cat, id: id, name: name.truncate(12) }));

    $item.hide();

    $(".infowindow").find("ul").append($item);
    $item.fadeIn(250);

    if ( $(".infowindow").find("li").length >= 1) {
      Infowindow.show();
    }

  }

  function _remove(name) {

    var id = name.replace(/ /g, "_").toLowerCase();

      if ($(".infowindow").find("li").length == 1) {
        _hide(null, function() { $(".infowindow").find("ul li#" + id).remove(); });
      } else {

        $(".infowindow").find("ul li#" + id).fadeOut(250, function() {
          $item.remove();
        });
      }
  }

  function _toggleItem(name, category, add) {
    console.log(name, add, "<-");
    if (add) {
      _add(name, category);
    } else {
      _remove(name);
    }
  }

  function _show(e) {
    $(".infowindow").show();
    $(".infowindow").animate({ opacity: 1 }, 250, "easeInExpo");
  }

  function _hide(e, callback) {

    $(".infowindow").animate({ marginTop: 50, opacity: 0 }, 250, "easeOutExpo", function() {
      $(this).hide();

      if (callback) {
        callback();
      }

    });
  }

  return {
    init: _init,
    hide: _hide,
    show: _show,
    toggleItem: _toggleItem,
    add: _add,
    remove: _remove
  };

}());

var Circle = (function() {

  var template, $circle, $title, $counter, $background, $explore, animating = true;

  function _build(){

    if ( $("#circle-template").length > 0 ) {

      template    = _.template($("#circle-template").html());
      $circle     = $(template({ count: summary.count, title: summary.title}));

      $title      = $circle.find(".title");
      $counter    = $circle.find(".counter");
      $background = $circle.find(".background");
      $explore    = $circle.find(".explore");

      $("#map").append($circle);

      return true;
    }

    return false;
  }

  function _show(delay) {

    if (!delay) {
      delay = 0;
    }

    $circle.delay(delay).animate({ top:'50%', marginTop:-1*($circle.height() / 2), opacity: 1 }, 250, function() {
      $title.animate({ opacity: 0.75 }, 150, "easeInExpo");
      $counter.animate({ opacity: 1 }, 150, "easeInExpo");
      animating = false;

      _onMouseLeave();
    });
  }

  function _onMouseEnter() {
    if (animating) return;

    $circle.find(".title, .counter").stop().animate({ opacity: 0 }, 100, "easeInExpo", function() {
      $circle.find(".explore, .background").stop().animate({ opacity: 1 }, 100, "easeOutExpo");
      $circle.addClass("selected");
    });
  }

  function _onMouseLeave() {
    if (animating) return;

    $circle.find(".explore, .background").stop().animate({ opacity: 0 }, 100, "easeOutExpo", function(){
      $title.animate({ opacity: 0.75 }, 100, "easeOutExpo");
      $counter.animate({ opacity: 1 }, 100, "easeOutExpo");
      $circle.removeClass("selected");
    });
  }

  function _hide(e) {
    if (e) {
      e.preventDefault();
    }

    animating = true;

    var _afterHide = function() {
      $circle.animate({ marginTop:0, opacity: 0 }, 250);
    };

    $circle.find(".title, .counter").animate({ opacity: 0 }, 150, "easeOutExpo", _afterHide);
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
  $play          = $timeline.find(".handle .play"),
  animationPid   = null,
  animationDelay = 1000,
  animationSpeed = 250,
  advance        = "10px",
  playing        = false,
  dates = [
    [0,  110, 2006],
    [120, 140, null],
    [150, 260, 2007],
    [270, 290, null],
    [300, 410, 2008],
    [420, 440, null],
    [450, 560, 2009],
    [570, 590, null],
    [600, 710, 2010],
    [720, 740, null],
    [750, 860, 2011]
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
      advance = "10px";
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

    animationPid = setTimeout(function() {

      $handle.animate({ left: "+=" + advance }, animationSpeed, "easeInExpo", function() {

        if ($handle.position().left >= dates[dates.length - 1][1]) {
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
    monthPos = ( -1 * date[0] + pos) / 10,
    month    = config.MONTHNAMES_SHORT[monthPos];

    $handle.find("div").html("<strong>" + month + "</strong> " + date[2]);
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
      grid: [10, 0],
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

  return {
    init: _init,
    hide: _hide,
    show: _show,
    isHidden: _isHidden
  };
})();
