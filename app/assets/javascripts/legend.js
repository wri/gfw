/* Legend
* Shows a list of the selected layers
*/
var Legend = (function() {

  var
  template,
  $legend,
  $content,
  legendHeight;

  function _init() {

    if (_build()) {

      // Makes it draggable
      $legend.draggable({
        containment: "#map-container .map",
        stop: function() {
          $.jStorage.set("legend", [$legend.offset().top, $legend.offset().left]);
        }
      });

      // Adds close binding
      $legend.find(".toggle").on("click", _toggle);
    }

  }

  function _build() {

    if ( $("#legend-template").length > 0 ) {

      template  = _.template($("#legend-template").html());
      $legend   = $(template({ layers: "" }));
      $content  = $legend.find(".content");

      var position = $.jStorage.get("legend");

      if (position) {
        var
        top  = position[0],
        left = position[1];

        $legend.css({ top: top, left: left, opacity:0 });

      }

      $("#content").append($legend);

      return true;
    }

    return false;
  }

  function _add(id, slug, name, category, title_color, title_subs) {

    if (category === null || !category) {
      category = 'Protected Areas';
    }

    var
    template = null,
    cat      = category.replace(/ /g, "_").toLowerCase();

    var
    color = null,
    extra = null;

    if (title_color) {

      template = _.template($("#legend-item-single-template").html());

      color = title_color;
      $item = $(template({ color:color, category: cat, id: id, name: name.truncate(32) }));

    } else {

      template = _.template($("#legend-item-double-template").html());

      var subs = eval(title_subs);

      var extraItems = _.map(subs, function(e) {
        return '<div class="icon" style="background-color:' + e.color + ';"></div> <a href="#">' + e.title + '</a>';
      }).join("\n");

      var parts = "<div class='extra'>" + extraItems + "</div>";

      var icons = _.map(subs, function(e) {
        return '<div class="half_icon" style="background-color:' + e.color + ';"></div>';
      }).join("\n");

      $item = $(template({ color:color, parts: parts, icons:icons, category: cat, id: id, name: name.truncate(32) }));

    }

    $item.hide();

    var $ul = null;

    if ( $(".legend").find("ul." + cat).length > 0 ) {

      $ul = $(".legend").find("ul." + cat);
      $ul.append($item);

      $item.fadeIn(250);
      $ul.fadeIn(250);
    } else {
      $ul = $("<ul class='"+cat+"' />");
      $ul.append("<li class='title "+ cat +" '>" + category + "</li>");
      $ul.append($item);
      $(".legend").find(".content").append($ul);

      $ul.fadeIn(250);
      $item.fadeIn(250);
    }

    if ( $(".legend").find("li").length >= 1 && showMap === true) {
      Legend.show();
    }
  }

  function _remove(id, name, category) {

    var
    slug  = name.replace(/ /g, "_").toLowerCase(),
    cat = category.replace(/ /g, "_").toLowerCase(),
    $li = $(".legend").find("ul li#" + id),
    $ul = $li.parent();

    $li.remove();

    if (cat == 'deforestation') {
      return;
    }

    if ($ul.find("li").length <= 0) {

      if ($(".legend").find("ul").length > 1) {

        $ul.fadeOut(150, function() {
          $(this).remove();
        });

      } else {
        $(".legend").fadeOut(150, function() {
          $ul.remove();
        });
      }
    }
  }

  function _reset(id, slug, name, category, title_color, title_subs) {
    var cat = category.replace(/ /g, "_").toLowerCase(),
    $ul = $(".legend ul." + cat);

    $ul.find("li").remove();

    _add(id, slug, name, category, title_color, title_subs);

  }

  function _toggleItem(id, slug, name, category, title_color, title_subs, add) {
    add ? _add(id, slug, name, category, title_color, title_subs) : _remove(id, name, category);

    if (GFW && GFW.app.infowindow) {
      GFW.app.infowindow.close();
    }

  }

  function _show(e) {
    if ( $(".legend").find("li").length >= 1 && showMap === true) {
      $(".legend").show();
      $(".legend").animate({ opacity: 1 }, 250, "easeInExpo");
    }
  }

  function _hide(e, callback) {

    $legend.animate({ marginTop: 50, opacity: 0 }, 250, "easeOutExpo", function() {
      $(this).hide();
      callback && callback();
    });
  }

  function _toggle(e, callback) {
    $legend.hasClass("closed") ? _maximize(callback) : _minimize(callback);
  }

  function _maximize(callback) {
    $legend.removeClass("closed");
    $legend.find(".content").animate({ height: legendHeight }, 250, "easeOutExpo", function() {
    $legend.css("height", "auto");

      $legend.find(".layer_count").fadeOut(250, function() {
        $content.find("ul").fadeIn(250);
      });

      callback && callback();
    });
  }

  function _minimize(callback) {

    $legend.addClass("closed");

    legendHeight = $legend.find(".content").height();

    $legend.find(".content").animate({ height: 12 }, 250, "easeOutExpo", function() {

      $content.find("ul").fadeOut(250, function() {
        var layer_count = $legend.find("li.title").length;

        if (layer_count != 1) layer_count = layer_count + " layers";
        else layer_count = layer_count + " layer";

        $legend.find(".layer_count").html(layer_count);
        $legend.find(".layer_count").fadeIn(250);

      });

      callback && callback();
    });

  }

  return {
    init: _init,
    hide: _hide,
    toggle: _toggle,
    show: _show,
    toggleItem: _toggleItem,
    add: _add,
    remove: _remove,
    reset: _reset
  };

}());
