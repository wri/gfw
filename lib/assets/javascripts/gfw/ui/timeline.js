gfw.ui.model.Timeline = Backbone.Model.extend({
  defaults: {
    playing: false
  }
});

gfw.ui.view.Timeline = gfw.ui.view.Widget.extend({
  className: "timeline_new",

  events: {

    "click .action":          "_onClickAction",
    "click .years li .month": "_onClickMonth",
    "mouseenter .handle":     "_onMouseEnterHandle",
    "mouseleave .handle":     "_onMouseLeaveHandle",
    "click .years li .year":  "_onClickYear"

  },

  initialize: function() {

    _.bindAll(this, "_onStartDrag", "_onDrag", "_onStopDragging");

    var template = $("#timeline_new-template").html();

    this.model = new gfw.ui.model.Timeline({
      startYear: 2006,
      endYear: 2010
    });

    this.model.on("change:left_handle",  this._onChangeLeftHandle,  this);
    this.model.on("change:right_handle", this._onChangeRightHandle, this);

    this.model.on("change:startYear", this._onChangeYears, this);
    this.model.on("change:endYear", this._onChangeYears, this);


    this.grid_x = 9;
    this.tipsy_visible = false;

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();

  },

  _onChangeYears: function() {

    this.$el.empty();
    this.render();

  },

  _onClickAction: function(e) {

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
    this.$left_handle.animate({ left: this.model.get("left_handle") }, { duration: 150, easing: "easeOutExpo" });
  },

  _onChangeRightHandle: function() {
    this.$right_handle.animate({ left: this.model.get("right_handle") }, { duration: 150, easing: "easeOutExpo" });
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

  },

  _onDrag: function(e) {

    this.dragging = true;

    this.model.set("left_handle",  this.$left_handle.position().left,  { silent: true });
    this.model.set("right_handle", this.$right_handle.position().left, { silent: true });

    var current_handle_pos = this.$current_drag.position().left;

    this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: this.$right_handle.position().left - this.$left_handle.position().left - this.grid_x });

    var x = this.$current_drag.position().left;

    if (this.months[x]) {
      this.$current_drag.find(".tipsy").html(this.months[x][0]);
      this.$current_drag.find(".tipsy").show();
    }

    if ( this.current_drag_side == 'left' && current_handle_pos + this.grid_x > this.$right_handle.position().left) {
      this.fixPosition = "left";
      return false;
    } else if ( this.current_drag_side == 'right' && current_handle_pos - this.grid_x < this.$left_handle.position().left) {
      this.fixPosition = "right";
      return false;
    }

  },

  _onStopDragging: function() {

    this.dragging = false;

    if (this.fixPosition) {

      if      (this.fixPosition == 'left')  this.model.set("left_handle",  this.model.get("right_handle") - this.grid_x*2);
      else if (this.fixPosition == 'right') this.model.set("right_handle", this.model.get("left_handle")  + this.grid_x*2);

      this.fixPosition = null;

    }

    this._adjustHandlePosition();

    var that = this;

    setTimeout(function(){ that.$current_drag.find(".tipsy").fadeOut(150); }, 2000)

  },

  _adjustHandlePosition: function() {

    var x = this.$current_drag.position().left;

    var year = _.find(this.years, function(y) {
      return (x >= (y[0] - 9) && x <= (y[0] + 27 - 9));
    });

    if (year) {
      var $year  = this.$el.find(".year[data-year='"+year[1]+"']");
      var $month = $year.next(".month");

      if ($month && $month.position()) {
        var l = $month.position().left;

        if (l) {
          this.model.set(this.current_drag_side + "_handle", l);
          this.$current_drag.find(".tipsy").html(this.months[l][0]);
        }
      }
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
      month_pos = _.keys(this.months)[_.size(this.months) - 1][0];
    } else {
      month_pos = $month.position().left;
    }

    var x = parseInt(month_pos, 10);
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    this._updateTipsy(x, left);

    if (left) {
      this.model.set("left_handle", x);
      this.$range.css({ left: x + this.grid_x, width: this.$right_handle.position().left - x - this.grid_x });
    } else {
      this.model.set("right_handle", x);
      this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: x - this.$left_handle.position().left - this.grid_x });
    }

  },

  _onClickMonth: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

    var that = this;

    var date = $(e.target).attr("data-date");

    var l = parseInt(this.model.get("left_handle"), 10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var x = parseInt($(e.target).position().left, 10);

    var left = (Math.abs(x - l) <= Math.abs(x - r));

    this._updateTipsy(x, left);

    if (left) {
      this.model.set("left_handle", x);
      this.$range.css({ left: x + this.grid_x, width: this.$right_handle.position().left - x - this.grid_x });
    } else {
      this.model.set("right_handle", x);
      this.$range.css({ left: this.$left_handle.position().left + this.grid_x, width: x - this.$left_handle.position().left - this.grid_x });
    }

  },

  _updateTipsy: function(x, left_side) {

    if (left_side) {

      if (this.months[x]) {
        this.$left_tipsy.html(this.months[x][0]);
        this.$left_tipsy.show().delay(2000).fadeOut(250);
      }

    } else {

      if (this.months[x]) {
        this.$right_tipsy.html(this.months[x][0]);
        this.$right_tipsy.show().delay(2000).fadeOut(250);
      }

    }

  },

  _addYears: function() {

    var start = parseInt(this.model.get("startYear"), 10);
    var end   = parseInt(this.model.get("endYear"),   10);

    var yearCount = (end - start);

    var liWidth = this.grid_x*12 + this.grid_x*4;
    var padding = this.grid_x*4  + 20 + 52;

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

    var currentMonths;

    for (var i = 0; i <= yearCount; i++) {

      if (i < yearCount) {
        currentMonths = months.replace(/year/g, start + i)
        this.$years.append("<li><a href='#' class='year' data-year='"+ (start + i) +"'>" + (start + i) + "</a>" + currentMonths + "</li>");
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

    var j = 0;

    _.each(this.$years.find(".year"), function(y, i) {
      // Store year positions
      that.years[i] = [$(y).position().left, $(y).attr("data-year")];

      // Store month positions
      _.each($(y).parent().find(".month"), function(m) {
        that.months[$(m).position().left] =  [$(m).attr("data-date"), j++];
      });

    });

  },

  render: function() {

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$left_handle  = this.$el.find(".handle.left");
    this.$right_handle = this.$el.find(".handle.right");

    this.$left_tipsy   = this.$left_handle.find(".tipsy");
    this.$right_tipsy  = this.$right_handle.find(".tipsy");

    this.$years        = this.$el.find(".years");
    this.$months       = this.$el.find(".visible_months");
    this.$trail        = this.$el.find(".trail");

    this.$range = this.$el.find(".range");

    this._addYears();

    this.options.container.append(this.$el);

    this._storeDatePositions();
    this._enableDrag();

    this.model.set("left_handle",  _.keys(this.months)[0]);
    this.model.set("right_handle", _.keys(this.months)[_.size(this.months)- 1]);

    this.$range.css({ left: this.model.get("left_handle"), width: this.model.get("right_handle") });
    this.$range.fadeIn(250);

    return this.$el;

  }

});
