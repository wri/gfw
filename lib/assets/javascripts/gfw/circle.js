var Circle = (function() {

  var template, $circle, $title, $counter, $background, $explore, animating = true, animatingB = false, circlePID;
  var p = 0;

  function toggleData() {
    var data = {};

    p = (p + 1) % circleSummary.length;

    $icon.removeClass("area");
    $icon.removeClass("flag");

    data = circleSummary[p];
    $icon.addClass(data.icon);
    $title.html(data.title);
    $counter.html(data.count);
  }

  function _build(){
    if ( $("#circle-template").length > 0 ) {
      template    = _.template($("#circle-template").html());
      $circle     = $(template(circleSummary[0]));
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
    if (animatingB) return false;

    animatingB = true;

    $icon.animate({ backgroundSize: "10%", opacity: 0 }, 250, "easeOutExpo", function() {
      $circle.delay(200).animate({ marginLeft: -350, opacity: 0 }, 350, "easeOutQuad", function() {
        toggleData();
        $circle.css({marginLeft: 100 });
        $circle.delay(400).animate({ marginLeft: -1*318/2, opacity: 1 }, 250, "easeOutQuad", function() {
          $icon.animate({ backgroundSize: "100%", opacity: 1 }, 250, "easeInExpo");
          animatingB = false;
        });
      });
    });
  }

  function _show(delay) {
    if (!delay) delay = 0;

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
    e && e.preventDefault();

    animating = true;

    var _afterHide = function() {
      $circle.animate({ marginTop:0, opacity: 0 }, 250, function() {
        $(this).hide();
      });
    };

    $circle && $circle.find(".title, .counter").animate({ opacity: 0 }, 150, "easeOutExpo", _afterHide);
  }

  function _onClick(e) {
    e && e.preventDefault();

    window.router.navigate("map", { trigger: true });
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
    toggleData: toggleData,
    hide: _hide
  };
})();