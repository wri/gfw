var Infowindow = (function() {

  var $infowindow = $(".infowindow");

  $(function() {

    // Makes it draggable
    $infowindow.draggable({ containment: "#map-container .map", handle: ".header" });

    // Adds close binding
    $infowindow.find(".close").on("click", _close);

  }());

  function _close(e) {
    e.preventDefault();

    $infowindow.animate({ marginTop: 50, opacity: 0 }, 250, "easeOutExpo", function() {
      $(this).hide();
    });
  }

  return {
    close: _close
  };

}());

var Circle = (function() {

  var
  template    = _.template($("#circle-template").html()),
  $circle     = $(template({count: summary.count, title: summary.title})),
  $title      = $circle.find(".title"),
  $counter    = $circle.find(".counter"),
  $background = $circle.find(".background"),
  $explore    = $circle.find(".explore");

  function _show() {
    $("#map").append($circle);

    $circle.on("mouseenter", _onMouseEnter);
    $circle.on("mouseleave", _onMouseLeave);

    $circle.delay(250).animate({ top:'50%', marginTop:-1*($circle.height() / 2), opacity: 1 }, 250, "easeOutExpo", function() {
      $title.animate({ opacity: 0.75 }, 150, "easeInExpo");
      $counter.animate({ opacity: 1 }, 150, "easeInExpo");
    });
  }

  function _onMouseEnter() {
    $title.animate({ opacity: 0 }, 150, "easeInExpo");
    $counter.animate({ opacity: 0 }, 150, "easeInExpo", function() {
      $background.animate({ opacity: 1 }, 150, "easeOutExpo");
    });
  }

  function _onMouseLeave() {
    $background.animate({ opacity: 0 }, 150, "easeOutExpo", function(){
      $title.animate({ opacity: 0.75 }, 150, "easeOutExpo");
      $counter.animate({ opacity: 1 }, 150, "easeOutExpo");
    });
  }

  function _hide() {
    $title.animate({ opacity: 0 }, 150, "easeOutExpo");
    $counter.animate({ opacity: 0 }, 150, "easeOutExpo", _afterHide);
  }

  function _afterHide() {
    $circle.animate({ marginTop: 100, opacity: 0 }, 250, "easeOutExpo");
  }

  return {
    show: _show,
    hide: _hide
  };

})();

var Timeline = (function() {

  var
  $timeline = $(".timeline"),
  $handle  = $timeline.find(".handle"),
  dates    = [
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

  function _gotoDate(e) {
    e.preventDefault();

    var year = parseInt($(this).text(), 10);

    _.each(dates, function(date, j) {
      if (date[2] === year) {
        $handle.animate({left: date[0]}, 150, "easeOutExpo");
        _changeDate(date[0], date);
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
      $timeline.animate({ bottom: parseInt($timeline.css("bottom"), 10) + 50, opacity: 1 }, 150, "easeInExpo", _afterShow);
    }
  }

  function _hide() {
    if (!_isHidden()) {

      $handle.fadeOut(250, function() {
        $timeline.animate({ bottom: parseInt($timeline.css("bottom"), 10) - 50, opacity: 0 }, 150, "easeOutExpo", _afterHide);
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
   */
  $(function() {

    $timeline.find("a").on("click", _gotoDate);

    $handle.draggable({
      containment: "parent",
      grid: [10, 0],
      axis: "x",
      drag: function() {
        var left = $(this).position().left;
        _setDate(left);
      },
      stop: function() {
        var left = $(this).position().left;
        _setDate(left, true);
      }
    });
  }());

  return {
    hide: _hide,
    show: _show,
    isHidden: _isHidden
  };
})();
