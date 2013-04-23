gfw.ui.model.Timeline = Backbone.Model.extend({
  defaults: {
    playing: false
  }
});

gfw.ui.view.Timeline = gfw.ui.view.Widget.extend({
  className: "timeline_new",

  events: {

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
      endYear: 2012
    });

    this.model.on("change:left_handle",  this._onChangeLeftHandle,  this);
    this.model.on("change:right_handle", this._onChangeRightHandle, this);


    this.grid_x = 9;
    this.tipsy_visible = false;

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();

  },

  _onMouseEnterHandle: function(e) { },

  _onMouseLeaveHandle: function(e) {
    var that = this;

    if (!this.$current_drag) return;

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
    this.$current_drag.find(".tipsy").fadeIn(150);

  },

  _onDrag: function(e) {

    this.dragging = true;

    this.model.set("left_handle",  this.$left_handle.position().left,  { silent: true });
    this.model.set("right_handle", this.$right_handle.position().left, { silent: true });

    var current_handle_pos = this.$current_drag.position().left;

    this.$el.find(".range").css({ left: this.$left_handle.position().left, width: this.$right_handle.position().left - this.$left_handle.position().left });

    if ( this.current_drag_side == 'left' && current_handle_pos + this.grid_x > this.$right_handle.position().left) {
      this.fixPosition = "left";
      return false;
    } else if ( this.current_drag_side == 'right' && current_handle_pos - this.grid_x < this.$left_handle.position().left) {
      this.fixPosition = "right";
      return false;
    }

    var x = this.$current_drag.position().left;
    this.$current_drag.find(".tipsy").html(this.months[x]);

  },

  _onStopDragging: function() {

    var that = this;

    this.dragging = false;

    if (this.fixPosition) {
      if      (this.fixPosition == 'left')  this.model.set("left_handle",  this.model.get("right_handle") - this.grid_x*2);
      else if (this.fixPosition == 'right') this.model.set("right_handle", this.model.get("left_handle")  + this.grid_x*2);

      this.fixPosition = null;
    }

    var x = this.$current_drag.position().left;

    _.each(this.years, function(y) {
      if (x >= (y[0] - 9) && x <= (y[0] + 27 - 9)) {

        var $year = that.$el.find(".year[data-year='"+y[1]+"']");
        var $month = $year.next(".month");

        if ($month && $month.position()) {
          var l = $month.position().left;
          if (l) {
            that.model.set(that.current_drag_side + "_handle", l);
            that.$current_drag.find(".tipsy").html(that.months[l]);
          }
        }

        return;
      }
    });

  },

  _onClickYear: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

    var that = this;

    var year = $(e.target).attr("data-year");

    var l = parseInt(this.model.get("left_handle"),  10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var $month = $(e.target).next(".month");

    if (!$month.position()) return; // TODO: add for the last year

    var x = parseInt($month.position().left, 10);
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    if (left) {
      this.$left_tipsy.html(this.months[x]);
      this.$left_tipsy.show().delay(2000).fadeOut(250);
    } else {
      this.$right_tipsy.html(this.months[x]);
      this.$right_tipsy.show().delay(2000).fadeOut(250);
    }

    if (left) this.model.set("left_handle", x);
    else this.model.set("right_handle", x);
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

    if (left) {
      this.$left_tipsy.html(this.months[x]);
      this.$left_tipsy.show().delay(2000).fadeOut(250);
    } else {
      this.$right_tipsy.html(this.months[x]);
      this.$right_tipsy.show().delay(2000).fadeOut(250);
    }

    if (left) this.model.set("left_handle", x);
    else this.model.set("right_handle", x);

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

    var month_names
    for (var i = 0; i < 12; i++) {
      var month = ( (i < 9) ? "0" + (i+1) : (i+1) );
      var month_name = config.MONTHNAMES_SHORT[i];

      months += "<a href='#' class='month' date-month='"+month+"' date-year='year' data-date='"+ month_name + " year'></a>";
    }

    var currentMonths;

    for (var i = 0; i <= yearCount; i++) {

      if (i < yearCount) {
        currentMonths = months.replace(/year/g, start + i)
        this.$years.append("<li><a href='#' class='year' data-year='"+ (start + i) +"'>" + (start + i) + "</a>" + currentMonths + "</li>");
      } else {
        this.$years.append("<li><a href='#' class='year' data-year='"+ (start + i) +"'>" + (start + i) + "</a></li>");
      }

    }

  },

  _storeDatePositions: function() {

    var that = this;

    this.years  = [];
    this.months = {};

    _.each(this.$years.find(".year"), function(y, i) {
      // Store year positions
      that.years[i] = [$(y).position().left, $(y).attr("data-year")];

      // Store month positions
      _.each($(y).parent().find(".month"), function(m) {
        that.months[$(m).position().left] =  $(m).attr("data-date");
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
    this.$trail        = this.$el.find(".trail");

    this._addYears();

    this.options.container.append(this.$el);

    this._storeDatePositions();
    this._enableDrag();

    this.model.set("left_handle",  _.keys(this.months)[0]);
    this.model.set("right_handle", _.keys(this.months)[_.size(this.months)- 1]);

    return this.$el;

  }

});
