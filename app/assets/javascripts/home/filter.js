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

  function _updateHash() {
    var hash,
        zoom = map.getZoom(),
        lat = map.getCenter().lat().toFixed(2),
        lng = map.getCenter().lng().toFixed(2);

    var layers = config.MAPOPTIONS.layers;

    if (layers) {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.ISO + "/" + layers;
      window.router.navigate(hash, { trigger: true, replace: true });
    } else {
      hash = "map/" + zoom + "/" + lat + "/" + lng + "/" + config.ISO;
      window.router.navigate(hash, { trigger: true } );
    }
  }

  function _toggle(id) {
    if(_.include(filters, id)) {
      filters = _.without(filters, id);
    } else {
      filters.push(id);
    }

    config.MAPOPTIONS.layers = filters;

    _updateHash();
  }

  function _toggleBiome(id) {
    var checkbox = $(".checkbox.forest_change");

    this.toggle(id);

    if(checkbox.hasClass("checked")) {
      $(checkbox).css("color", "#ccc");
      $(checkbox).find("i").css("background-color", "#ccc");
      $(checkbox).removeClass("checked");
    }
  }

  function _disableBiome() {
    $(".checkbox.forest_change").addClass("disabled").closest("li").addClass("disabled");
  }

  function _enableBiome() {
    $(".checkbox.forest_change").removeClass("disabled").closest("li").removeClass("disabled");
  }

  function _show(callback) {
    if (!$filters.hasClass("hide")) return;

    var count = categories.length;

    $filters.fadeIn(150, function() {
      $filters.find("li").each(function(i, el) {
        $(el).delay(i * 50).animate({ opacity: 1 }, 150, "easeInExpo", function() {
          $(this).find("a").animate({ top: "-15px"}, 150);
          count--;

          if (count <= 0) {
            $filters.removeClass("hide");

            if (callback) callback();
            _calcFiltersPosition();
          }
        });
      });
    });
  }

  function _hide(callback) {
    _hideLayer();

    if ($filters.hasClass("hide")) {
      callback && callback();

      return;
    }

    var count = categories.length;

    $($filters.find("li a").get().reverse()).each(function(i, el) {
      $(el).delay(i * 50).animate({ top: "15px" }, 150, function() {
        $(this).parent().animate({ opacity: "0"}, 150, function() {
          --count;

          if (count <= 0) {
            $filters.fadeOut(150, function() {
              $filters.addClass("hide");

              if (callback) callback();
            });
          }
        });
      });
    });
  }

  function _calcFiltersPosition() {
    $filters.find("li").each(function(i, el) {
      $(el).data("left-pos", $(el).position().left + 11);
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
    var color = $li.find("a").css("color");

    $layer.find("a.title").css({ color: color });
    $layer.find(".line").css({ backgroundColor: color });

    $layer.find(".links li.last").removeClass('last');
    $layer.find(".links li").hide();
    $layer.find(".links li." + liClass).show();
    $layer.find(".links li." + liClass).last().addClass("last");



    $layer.find(".source").off("click");
    // $layer.find(".source").on("click", function(e) {
    //   e.preventDefault();

    //   var source = $(e.target).attr("data-slug");

    //   sourceWindow.show(source).addScroll();
    // });



    $layer.addClass(liClass);

    lastClass = liClass;

    var
    width  = $li.width() < 170 ? 170 : $li.width(),
    left   = (l + $li.width() / 2) - (width / 2),
    height = $layer.find(".links").height();

    $layer.find("li").css({ width:width - 20});
    $layer.css({ left: left, width:width, top: -17});

    $layer.animate({ opacity: 1 }, 250);

    $(".scroll").css({ height: $layer.find(".links").height() });

    // if (scrollPane) {
    //   scrollPane.reinitialise();
    // } else {
    //   $pane.jScrollPane( { showArrows: true });
    //   scrollPane = $pane.data('jsp');
    // }
    // window.scrollPane = scrollPane;

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
    $(document).on("mouseenter", ".filters li", _open);
    $layer.on("mouseleave", _closeOpenFilter);
  }

  function _check(id) {
    $("#layer a[data-id=" + id +"]").addClass("checked");
    var color = $("#layer a[data-id=" + id +"]").attr("data-color");
    $("#layer a[data-id=" + id +"]").css("color", color );
    $("#layer a[data-id=" + id +"]").find("i").css("background-color", color );

    filters.push(id);
  }

  function _fakeCheck(id) {
    filters.push(id);
  }

  function _addFilter(id, slug, category, name, options) {

    var
    clickEvent  = options.clickEvent  || null,
    disabled    = options.disabled    || false;
    source      = options.source      || null;
    category_color = options.category_color || "#ccc";
    color       = options.color       || "#ccc";

    if (category === null || !category) {
      category = 'Protected Areas';
    }

    var cat  = category.replace(/ /g, "_").toLowerCase();

    if (!_.include(categories, cat)) {
      var
      template = _.template($("#filter-template").html()),
      $filter  = $(template({ name: category, category: cat, data: cat, category_color: category_color }));

      $filters.find("ul").append($filter);
      categories.push(cat);
    }

    var
    layerItemTemplate = null,
    $layerItem        = null;

    if (!disabled) { // click binding
      // Select the kind of input (radio or checkbox) depending on the category
      if (cat === 'forest_change' && slug != 'biome') {
        layerItemTemplate = _.template($("#layer-item-radio-template").html());
        $layerItem = $(layerItemTemplate({ name: name, id: id, slug:slug, category: cat, disabled: disabled, source: source }));

        $layerItem.find("a:not(.source)").on("click", function() {
          if (!$(this).find(".radio").hasClass("checked")) {
            clickEvent && clickEvent();
          }
        });
      } else {
        layerItemTemplate = _.template($("#layer-item-checkbox-template").html());
        $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));

        $layerItem.find("a:not(.source)").on("click", function() {
          clickEvent();
        });
      }
    } else {
      layerItemTemplate = _.template($("#layer-item-disabled-template").html());
      $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));

      $layerItem.find("a:not(.source)").on("click", function(e) {
        preventDefault();
      });
    }

    $layer.find(".links").append($layerItem);
    $layerItem.find(".checkbox").addClass(cat);

    // We select the FORMA layer by default
    if ( slug === "forma" ) {
      $layerItem.find(".radio").addClass('checked');
    }
  }

  return {
    init: _init,
    show: _show,
    hide: _hide,
    addFilter: _addFilter,
    toggle: _toggle,
    toggleBiome: _toggleBiome,
    disableBiome: _disableBiome,
    enableBiome: _enableBiome,
    closeOpenFilter:_closeOpenFilter,
    calcFiltersPosition: _calcFiltersPosition,
    check: _check,
    fakeCheck: _fakeCheck
  };

}());