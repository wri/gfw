gfw.ui.model.TimelineLoss = Backbone.Model.extend({
  defaults: {
    hidden: true,
    playing: false,
    animationSpeed: 200,
    animationDelay: 100
  }
});

gfw.ui.view.TimelineLoss = gfw.ui.view.Widget.extend({
  className: "timeline",

  events: {

    "click .action":          "_onClickAction",
    "click .years li .month": "_onClickMonth",
    "click .years li .year":  "_onClickYear",
    "mouseenter .handle":     "_onMouseEnterHandle",
    "mouseleave .handle":     "_onMouseLeaveHandle"

  },

  initialize: function() {

    _.bindAll(this, "_onStartDrag", "toggle", "_onDrag", "_onStopDragging", "_animate", "_stopAnimation");

    var template = $("#timeline_loss-template").html();

    this.model = new gfw.ui.model.TimelineLoss({
      hidden:    true,
      startYear: 2005,
      endYear:   2013
    });

    this.add_related_model(this.model);

    this.model.set("play_mode", true);

    // Bindings
    this.model.on("change:line",         this._onChangeLine,  this);
    this.model.on("change:left_handle",  this._onChangeLeftHandle,  this);
    this.model.on("change:right_handle", this._onChangeRightHandle, this);
    this.model.on("change:startYear",    this._onChangeYears,       this);
    this.model.on("change:endYear",      this._onChangeYears,       this);
    this.model.on("change:play_mode",    this._onChangePlayMode,    this);

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);

    // Defaults
    this.grid_x        = 9;
    this.animationPid  = null;
    this.tipsy_visible = false;
    this.playing       = false;

    this.first_month   = 71; // Numeric value of the first month of the timeline (January 2006)

    this.range_year    = [this.model.get("startYear"), this.model.get("endYear") - 1];

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();

  },

  /**
  * Refresh map
  */
  refresh: function() {

    if (!this.$left_handle) return;
    this._updateMap("left", this.$left_handle.position().left);

  },

  show: function() {

    if (analysis.analyzing || !showMap) return;

    this.model.set("hidden", false);

    this._updateMap("left", this.$left_handle.position().left);

    return this;

  },

  hide: function(callback) {

    this.model.set("hidden", true);

    this._stopAnimation();

    return this;

  },

  /**
  * Moves the month line into its starting position
  */
  _setupLine: function() {

    this.model.set({ fadeIn: true, line: this.model.get("left_handle") + 9 });

  },

  _stopAnimation:function(animated) {
    this.playing = false;

    clearTimeout(this.animationPid);

    this.model.set("play_mode", true);
  },

  _animate: function() {

    var that = this;

    if (!this.playing) return;

    clearTimeout(this.animationPid);

    this.animationPid = setTimeout(function() {

      that._animate_action();
      that._loop();

    }, this.model.get("animationSpeed"));

  },

  _loop: function() {
    var that = this;

    setTimeout(function() {

      var x = parseInt(that.model.get("line"), 10);

      that._updateMap("right", x);
      that._animate();

    }, this.model.get("animationDelay"));

  },

  _animate_action: function() {

    var line_x = parseInt(this.model.get("line"), 10);

    if (line_x >= this.model.get("right_handle")) {
      this.model.set("line", line_x + 6 );
      this._stopAnimation();
    } else {

      console.log(this.months[line_x]);

      this.model.set("line", line_x + this.grid_x );
    }

    if (this.months[line_x]) {
      this.$line.find(".tipsy span").html(this.months[line_x][0]);
    }

    if (!this.playing) return;

  },

  // Return date array [start_year, start_month, end_year, end_month] for current
  // timline handle positions.
  _getDates: function(side, value) {
    var start_pos, end_pos;

    if (!this.$left_handle || !this.$right_handle) return;

    if (side == 'left') {
      start_pos = value;
      end_pos   = this.$right_handle.position().left;
    } else {
      start_pos = this.$left_handle.position().left;
      end_pos   = value;
    }

    if (this.months[start_pos] && this.months[end_pos]) {

      var start_month = this.first_month + this.months[start_pos][1];
      var start_year  = this.months[start_pos][2];

      var end_month   = this.first_month + this.months[end_pos][1];
      var end_year    = this.months[end_pos][2];

      return [start_year, start_month, end_year, end_month];
    }
  },

  _updateMap: function(side, value) {
    var dates = this._getDates(side, value);
    if (dates) {
      this.trigger('change_date', dates[0], dates[3], dates[2]);
      publish('timeline:change_date', dates);
    }
  },

  _onChangeYears: function() {

    this.$el.empty();
    this.render();

  },

  _onChangePlayMode: function(e) {

    var that = this;

    if (this.model.get("play_mode")) this._pause();
    else this._play();

  },

  _pause: function() {

      var that = this;

      this.playing = false;

      this.$pause.fadeOut(150, function() {

        that.$play.fadeIn(150);
        that._stopAnimation();

        that.$line.delay(1000).fadeOut(150, function() {
          that.loadDefaultRange();
        });

      });

  },

  _play: function() {

    var that = this;

    this.playing = true;

    this._setupLine();

    this.$play.fadeOut(150, function() {
      that.$pause.fadeIn(250);
      that._animate();
    });

  },

  _onClickAction: function(e) {

    e.preventDefault();
    e.stopPropagation();

    this.$left_handle.find(".tipsy").hide();
    this.$right_handle.find(".tipsy").hide();

    this.model.set("play_mode", !this.model.get("play_mode"));

  },

  _onMouseEnterHandle: function(e) { },

  _onMouseLeaveHandle: function(e) {
    var that = this;

    if (!this.$current_drag || !this.tipsy_visible) return;

    if (!this.dragging) this.$current_drag.find(".tipsy").delay(1000).fadeOut(150, function() {
      that.tipsy_visible = false;
    });
  },

  _onChangeLine: function() {
    var that = this;

    this.$line.animate({ left: this.model.get("line") }, { duration: 150, easing: "easeOutExpo", complete: function() {

      if (that.model.get("fadeIn")) {
        that.$line.fadeIn(150);
        that.model.set("fadeIn", false);
      }

    }});
  },

  _onChangeLeftHandle: function() {
    this.$left_handle.animate({ left: this.model.get("left_handle") }, { duration: 100, easing: "easeOutExpo" });
  },

  _onChangeRightHandle: function() {
    this.$right_handle.animate({ left: this.model.get("right_handle") }, { duration: 100, easing: "easeOutExpo" });
  },

  _enableDrag: function() {

    this.$el.find(".handle").draggable({
      containment: "parent",
      grid: [this.grid_x, 0],
      axis: "x",
      start: this._onStartDrag,
      drag:  this._onDrag,
      stop:  this._onStopDragging
    });

  },

  _onStartDrag: function(e) {

    this.dragging = true;

    this.$current_drag     = $(e.target);
    this.current_drag_side = this.$current_drag.hasClass("left") ? "left" : "right";

    this.$current_drag.find(".tipsy").fadeIn(50);

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set("play_mode", true);
      return;
    }

  },

  _onDrag: function(e) {

    this.dragging = true;

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set("play_mode", true);

      return;
    }

    this.model.set("left_handle",  this.$left_handle.position().left,  { silent: true });
    this.model.set("right_handle", this.$right_handle.position().left, { silent: true });

    var current_handle_pos = this.$current_drag.position().left;

    this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: this.$right_handle.position().left - this.$left_handle.position().left - this.grid_x });

    var x = this.$current_drag.position().left;

    this._updateDate(x);
    this._updateRangeYears(x, (this.current_drag_side == 'left'));

    if (this.current_drag_side == 'left') this._updateMap("left", x);
    else this._updateMap("right", x);

    if ( this.current_drag_side == 'left' && current_handle_pos + this.grid_x > this.$right_handle.position().left) {
      this.fixPosition = "left";
      return false;
    } else if ( this.current_drag_side == 'right' && current_handle_pos - this.grid_x < this.$left_handle.position().left) {
      this.fixPosition = "right";
      return false;
    }

  },


  /**
  * Highlights the years inside of the selection
  */

  _highlightYears: function() {

    var min = this.$el.find(".year[data-year=" + this.range_year[0] + "]").parent().index();
    var max = this.$el.find(".year[data-year=" + this.range_year[1] + "]").parent().index();

    if (min == max) {
      this.$el.find(".years .year").removeClass("active");
      return;
    }

    this.$el.find(".years li:gt(" + (min) + "):lt(" + (max) + ") .year").addClass("active");
    this.$el.find(".years li:lt(" + (min + 1) + ") .year, .years li:gt(" + (max) + ") .year").removeClass("active");

  },

  _updateDate: function(x) {

    if (x && this.months[x]) {

      var date = this.months[x][0];

      this._updateCurrentTipsyDate(date);
      this._highlightYears();

      this.$current_drag && this.$current_drag.find(".tipsy").show();
    }

  },

  _onStopDragging: function() {

    var that = this;

    this.dragging = false;

    if (this.fixPosition) {

      if      (this.fixPosition == 'left')  this.model.set("left_handle",  this.model.get("right_handle") - this.grid_x*2);
      else if (this.fixPosition == 'right') this.model.set("right_handle", this.model.get("left_handle")  + this.grid_x*2);

      this.fixPosition = null;

    }

    this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: this.$right_handle.position().left - this.$left_handle.position().left - this.grid_x });

    this._adjustHandlePosition();

    publish('timeline:onStopDragging');

    setTimeout(function(){ that.$current_drag.find(".tipsy").fadeOut(150); }, 2000)
  },

  _adjustHandlePosition: function() {

    var x = this.$current_drag.position().left;

    var year = _.find(this.years, function(y) {
      return (x >= (y[0] - 9) && x <= (y[0] + 27 - 9));
    });

    if (typeof(year[1]) == "number" ) {

      var $year  = this.$el.find(".year[data-year='"+year[1]+"']");
      var $month = $year.next(".month");

      var month_pos;

      if (!$month.position()) {
        month_pos = _.keys(this.months)[_.size(this.months) - 1];
      } else {
        month_pos = $month.position().left;
      }

      this.model.set(this.current_drag_side + "_handle", month_pos);
      this.$current_drag.find(".tipsy span").html(this.months[month_pos][0]);

      if (this.current_drag_side == 'left') {
        this.$line.find(".tipsy span").html(this.months[month_pos][0]);
      } else {

        var width = month_pos - this.$left_handle.position().left - this.grid_x;
        this.$range.width(width);
      }

      this._updateRangeYears(month_pos, (this.current_drag_side == 'left'));
      this._highlightYears();

    }

  },

  _onClickYear: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

    var that = this;

    var year = $(e.target).attr("data-year");

    var l = parseInt(this.model.get("left_handle"),  10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var $month = $(e.target).next(".month");

    var month_pos;

    if (!$month.position()) {
      month_pos = _.keys(this.months)[_.size(this.months) - 1];
    } else {
      month_pos = $month.position().left;
    }

    var x = parseInt(month_pos, 10);
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    if (left) {

      this.$current_drag = this.$left_handle;

      this.model.set("left_handle", x);
      this.$range.css({ left: x + this.grid_x, width: this.$right_handle.position().left - x - this.grid_x });
    } else {
      this.$current_drag = this.$right_handle;
      this.model.set("right_handle", x);
      this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: x - this.$left_handle.position().left - this.grid_x });
    }

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set("play_mode", true);
    }

    if (left) this._updateMap("left", x);
    else this._updateMap("right", x);

    this._updateRangeYears(x, left);
    this._highlightYears();

    this._updateTipsy(x, left);


  },

  _onClickMonth: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

    var date = $(e.target).attr("data-date");

    var l = parseInt(this.model.get("left_handle"),  10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var x = parseInt($(e.target).position().left, 10);

    // Is it the left handle the closest one to the click?
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    this._updateTipsy(x, left);

    var left_pos, width;

    if (left) {
      this.$current_drag = this.$left_handle;
      this.model.set("left_handle", x);
      left_pos = x + this.grid_x;
      width    = this.$right_handle.position().left - x - this.grid_x;
    } else {

      this.$current_drag = this.$right_handle;
      this.model.set("right_handle", x);
      left_pos = this.$left_handle.position().left + this.grid_x;
      width    = x - this.$left_handle.position().left - this.grid_x;
    }

    this.$range.css({ left: left_pos, width: width });

    if (this.playing) { // Stop the animation if it's playing
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set("play_mode", true);
    }

    this._updateRangeYears(x, left);
    this._updateDate(x);

    if (left) this._updateMap("left", x);
    else this._updateMap("right", x);

    this._highlightYears();

  },

  _updateRangeYears: function(x, left) {

    if (this.months[x]) {
      if (left) this.range_year[0] = this.months[x][2];
      else      this.range_year[1] = this.months[x][2];
    }

  },

  _updateCurrentTipsyDate: function(date) {
    this.$current_drag && this.$current_drag.find(".tipsy span").html(date);
    this.$line.find(".tipsy span").html(date);
  },

  _updateTipsy: function(x, left_side) {
    if (this.months[x]) {

      if (left_side) {
        this.$right_tipsy.hide();
        this.$left_tipsy.find("span").html(this.months[x][0]);
        this.$line.find(".tipsy span").html(this.months[x][0]);
        this.$left_tipsy.show().delay(2000).fadeOut(250);
      }

    } else {
      this.$left_tipsy.hide();
      this.$right_tipsy.find("span").html(this.months[x][0]);
      this.$right_tipsy.show().delay(2000).fadeOut(250);
    }
  },

_addYears: function() {

  var start = parseInt(this.model.get("startYear"), 10);
  var end   = parseInt(this.model.get("endYear"),   10);

  var yearCount = (end - start);

  var liWidth = this.grid_x*12 + this.grid_x*4;
  var padding = this.grid_x*4 + 20 + 52;

  var width = padding + (yearCount)*liWidth;

  this.setWidth(width);
  this.$el.css({ marginLeft: -width/2, left: "50%" });

  var months = "";
  var visible_months = "";

  var month_names

  for (var i = 0; i < 12; i++) {
    var month = ( (i < 9) ? "0" + (i+1) : (i+1) );
    var month_name = config.MONTHNAMES_SHORT[i];

    months += "<a href='#' class='month' date-month='"+month+"' date-year='year' data-date='"+ month_name + " year'></a>";
    visible_months += "<div class='month'></div>";
  }

  var currentMonths, active;

  for (var i = 0; i <= yearCount; i++) {

    if (i < yearCount) {
      currentMonths = months.replace(/year/g, start + i)

      if (i > 0) active = " active";
      else active = "";

      this.$years.append("<li><a href='#' class='year"+active+"' data-year='"+ (start + i) +"'>" + (start + i) + "</a>" + currentMonths + "</li>");
      this.$months.append("<li><div class='year'></div>" + visible_months + "</li>");
    } else {
      this.$years.append("<li><a href='#' class='year' data-year='"+ (start + i) +"'>" + (start + i) + "</a></li>");
    }

  }

},

_storeDatePositions: function() {

  var that = this;

  this.years  = [];
  this.months = {};

  var j    = 0;
  var year = 0;

  _.each(this.$years.find(".year"), function(y, i) {

    // Store year positions
    year = parseInt($(y).attr("data-year"), 10);
    that.years[i] = [$(y).position().left, year];

    // Store month positions
    _.each($(y).parent().find(".month"), function(m) {
      that.months[$(m).position().left] =  [$(m).attr("data-date"), j++, year];
    });

  });

},

_init: function() {

  if (this.initialized) return;

  this.initialized = true;

  this.$left_handle  = this.$el.find(".handle.left");
  this.$right_handle = this.$el.find(".handle.right");

  this.$line         = this.$el.find(".line");

  this.$left_tipsy   = this.$left_handle.find(".tipsy");
  this.$right_tipsy  = this.$right_handle.find(".tipsy");

  this.$play         = this.$el.find(".action .play");
  this.$pause        = this.$el.find(".action .pause");

  this.$years        = this.$el.find(".years");
  this.$months       = this.$el.find(".visible_months");
  this.$trail        = this.$el.find(".trail");

  this.$coordinates  = this.$el.find(".coordinates");

  this.$range = this.$el.find(".range");

  this._addYears();

  this.options.container.append(this.$el);

  this._storeDatePositions();
  this._enableDrag();

  var left_handle_x  = parseInt(_.keys(this.months)[0], 10);
  var right_handle_x = _.keys(this.months)[_.size(this.months)- 1];

  this.model.set("left_handle",  left_handle_x);
  this.model.set("right_handle", right_handle_x);
  this.model.set("line", left_handle_x + 5);

  if (this.months[left_handle_x]) {
    this.$line.find(".tipsy span").html(this.months[left_handle_x][0]);
  }

  this.$range.css({ left: this.model.get("left_handle"), width: this.model.get("right_handle") - 9*2 });
  this.$range.fadeIn(250);

},

loadDefaultRange:function() {
  var x = this.model.get("right_handle");
  this._updateMap("right", parseInt(x, 10));
},

toggle: function() {

  if (this.model.get("hidden")) {
    this.$el.fadeOut(this.defaults.speed);
  } else {
    this.$el.fadeIn(this.defaults.speed);
    this._init();
  }

},

updateCoordinates: function(latLng) {

  var lat = parseFloat(latLng.lat());
  var lng = parseFloat(latLng.lng());

  lat = lat.toFixed(6);
  lng = lng.toFixed(6);

  if (this.$coordinates) {
    this.$coordinates.html("Lat/Long: "+lat + "," + lng);
  }

},

render: function() {
  this.$el.append(this.template.render( this.model.toJSON() ));
  return this.$el;
}

});
