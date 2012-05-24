var Timeline = (function() {

  var
  $tooltip = $(".tooltip"),
  $handle  = $(".timeline .handle"),
  dates    = [
    [0,   30,  null],
    [40,  150, 2006],
    [160, 180, null],
    [190, 300, 2007],
    [310, 330, null],
    [340, 450, 2008],
    [460, 480, null],
    [490, 600, 2009],
    [610, 630, null],
    [640, 750, 2010],
    [760, 780, null],
    [790, 900, 2011],
    [910, 930, null]
  ];

  function _centerTooltip(handlePos) {
    var pos = handlePos + 8 - ($(".tooltip").width() / 2);
    $(".tooltip").css({ left: pos });
  }

  function _changeDate(pos, i) {
    var
    monthPos = ( -1*i[0] + pos) / 10,
    month    = config.MONTHNAMES_SHORT[monthPos];

    $tooltip.find("div").html("<strong>" + month + "</strong> " + i[2]);
  }

  function _setDate(pos, stop) {
    var
    match      = false;

    _.each(dates, function(i, j) {
      if (pos >= i[0] && pos <= i[1]) {

        if (i[2]) {
          _changeDate(pos, i);
          match = true;
        } else {

          var
          newDate     = (dates[ j + 1 ]) ? dates[ j + 1 ] : dates[ j - 1 ],
          newPosition = (dates[ j + 1 ]) ? newDate[0] : newDate[1];

          $handle.css("left", newPosition);

          if (stop) {
            match = true;
            _centerTooltip(newPosition);
            _changeDate(newPosition, newDate);
          }
        }

        return;
      }
    });


    if (!match) {

      $tooltip.fadeOut(150, function() {
        $(this).addClass("hidden");
      });

    } else {
      if ($tooltip.hasClass("hidden")) {

        $tooltip.fadeIn(150, function() {
          $(this).removeClass("hidden");
        });

      }
    }
  }

  $(function() { // init function

    $handle.draggable({
      containment: "parent",
      grid: [10, 0],
      axis: "x",
      drag: function() {
        var left = $(this).position().left;
        _centerTooltip(left);
        _setDate(left);
      },
      stop: function() {
        var left = $(this).position().left;
        _centerTooltip(left);
        _setDate(left, true);
      }
    });
  }());

  //return {
  //};

})();
