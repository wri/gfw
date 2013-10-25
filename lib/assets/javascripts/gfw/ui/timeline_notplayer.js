gfw.ui.model.TimelineNotPlayer = Backbone.Model.extend({
  defaults: {
    hidden: true
  }
});

gfw.ui.view.TimelineNotPlayer = gfw.ui.view.Widget.extend({
  className: "timeline timeline_notplayer",

  events: {

    "click .years li .month": "_onClickMonth",
    "click .years li .year":  "_onClickYear",
    "mouseenter .handle":     "_onMouseEnterHandle",
    "mouseleave .handle":     "_onMouseLeaveHandle"

  },

  initialize: function() {

    _.bindAll(this, "toggle");

    var template = $("#timeline_notplayer-template").html();

    this.model = new gfw.ui.model.TimelineNotPlayer({
      startYear: 2006,
      endYear:   2013
    });

    this.add_related_model(this.model);

    // Bindings
    this.model.on("change:left_handle",  this._onChangeLeftHandle,  this);
    this.model.on("change:right_handle", this._onChangeRightHandle, this);
    this.model.on("change:startYear",    this._onChangeYears,       this);
    this.model.on("change:endYear",      this._onChangeYears,       this);

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);

    // Defaults
    this.grid_x        = 9;
    this.tipsy_visible = false;

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

  show: function(callback) {

    if (analysis.analyzing || !showMap) return;

    if (Filter) Filter.show();

    this.model.set("hidden", false);

    callback && callback();

    return this;
  },

  hide: function(callback) {
    this.model.set("hidden", true);

    callback && callback();

    return this;
  },

  _updateMap: function(side, value) {

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

      //console.log(start_month, start_year, " - ", end_month, end_year);

      this.trigger('change_date', start_month, end_month, start_year);
    }

  },

  _onChangeYears: function() {

    this.$el.empty();
    this.render();

  },

  _onMouseEnterHandle: function(e) { },

  _onMouseLeaveHandle: function(e) {
    var that = this;

    if (!this.$current_drag || !this.tipsy_visible) return;

    if (!this.dragging) this.$current_drag.find(".tipsy").delay(1000).fadeOut(150, function() {
      that.tipsy_visible = false;
    });
  },

  _onChangeLeftHandle: function() {
    this.$left_handle.animate({ left: this.model.get("left_handle") }, { duration: 100, easing: "easeOutExpo" });
  },

  _onChangeRightHandle: function() {
    this.$right_handle.animate({ left: this.model.get("right_handle") }, { duration: 100, easing: "easeOutExpo" });
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
    }

  },

  _onClickYear: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

  },

  _onClickMonth: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

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

    console.log(x, left_side);

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
  var padding = this.grid_x*4  + 20;

  var width = padding + (yearCount)*liWidth;

  this.setWidth(width);
  this.$el.css({
    marginLeft: -width/2,
    left: "50%",
    height: "50px"
  });

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

  this.$left_tipsy   = this.$left_handle.find(".tipsy");
  this.$right_tipsy  = this.$right_handle.find(".tipsy");

  this.$years        = this.$el.find(".years");
  this.$months       = this.$el.find(".visible_months");
  this.$trail        = this.$el.find(".trail");

  this.$coordinates  = this.$el.find(".coordinates");

  this.$range = this.$el.find(".range");

  this._addYears();

  this.options.container.append(this.$el);

  this._storeDatePositions();

  var left_handle_x  = parseInt(_.keys(this.months)[0], 10);
  var right_handle_x = _.keys(this.months)[_.size(this.months)- 1];

  this.model.set("left_handle",  left_handle_x);
  this.model.set("right_handle", right_handle_x);

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

  lat = lat.toFixed(2);
  lng = lng.toFixed(2);

  if (this.$coordinates) {
    this.$coordinates.html(lat + ", " + lng);
  }

},

render: function() {
  this.$el.append(this.template.render( this.model.toJSON() ));
  return this.$el;
}

});
