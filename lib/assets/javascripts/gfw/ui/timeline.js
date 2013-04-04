gfw.ui.model.Timeline = Backbone.Model.extend({
  defaults: {
    playing: false
  },

  togglePlaying: function() {
    this.playing = !this.playing;
  }

});

gfw.ui.view.Timeline = gfw.ui.view.Widget.extend({

  className: 'timeline',

  events: {

    "click .years a": "gotoDate",
    "click .play": "play"

  },

  defaults: {
    speed: 300,
    animationDelay: 500,
    animationSpeed: 120,
    step: 8,  // distance between the points/months
    advance: "8px",
    dates: [
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
    ]
  },

  initialize: function() {

    _.bindAll( this, "toggle", "play", "gotoDate" );

    this.options = _.extend(this.options, this.defaults);

    this.model.bind("change:hidden", this.toggle);

    var template = $("#timeline-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  _togglePlayState: function() {
    this.$play.fadeOut(100, "easeOutExpo", function() {
      $(this).toggleClass("playing");
      $(this).fadeIn(100, "easeInExpo");
    });
  },

  play: function(e) {

    e && e.preventDefault();

    this.model.togglePlaying();

    if (this.$handle.position().left >= this.options.dates[this.options.dates.length - 1][1]) {
      this.model.set("playing", false);

      // Fake toggle
      $play.fadeOut(100, "easeOutExpo", function() {
        $(this).fadeIn(100, "easeInExpo");
      });

    } else {
      this._togglePlayState();
    }

    if (this.model.get("playing")) {
      this.model.set("advance", this.options.step + "px");
      this.animate();
    } else {
      this.stopAnimation(true);
    }

  },

  stopAnimation: function(animated) {
    this.model.set("advance", 0);
    this.model.set("playing", false);

    clearTimeout(this.model.get("animationPid"));

    if (this.model.get("animated")) {
      this.$play.fadeOut(100, "easeOutExpo", function() {
        $(this).removeClass("playing");
        $(this).fadeIn(100, "easeInExpo");
      });
    } else {
      this.$play.removeClass("playing");
    }
  },

  gotoDate: function(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    if ($(this).parent().hasClass("disabled")) return;

    var
    year     = parseInt($(this).text(), 10),
    lastYear = parseInt($timeline.find(".years li:last-child a").text(), 10);

    // if the user clicked on the last year of the timeline
    if (year === lastYear) {
      var pos = dates[ dates.length - 1 ][1];
      console.log(pos);

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
  },

  animate: function() {

    var that = this;

    if (!this.model.get("playing")) return;

    clearTimeout(this.model.get("animationPid"));

    var animationPid = setTimeout(function() {

      that.$handle.animate({ left: "+=" + this.model.get("advance") }, this.options.animationSpeed, "easeInExpo", function() {

        if (that.$handle.position().left >= that.optionis.dates[that.options.dates.length - 1][1] || $handle.position().left == that.options.dates[that.options.dates.length - 1][0] ) {
          that.stopAnimation(true);
          that.setDate(that.$handle.position().left);
        }

        if (!that.model.get("playing")) return;

        that.setDate(that.$handle.position().left);
        that.animate();
      });

    }, this.options.animationDelay);

    this.model.set("animationPid", animationPid);

  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$handle      = this.$el.find(".handle");
    this.$coordinates = this.$el.find(".coordinates");
    this.$play        = this.$el.find(".handle .play");

    return this.$el;

  }

});
