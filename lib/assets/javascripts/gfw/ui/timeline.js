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

    _.bindAll(this, "_onStartDrag", "_onDrag", "_onStop");

    var template = $("#timeline_new-template").html();

    this.model = new gfw.ui.model.Timeline({
      startYear: 2006,
      endYear: 2012
    });

    this.model.on("change:left_handle",  this._onChangeLeftHandle,  this);
    this.model.on("change:right_handle", this._onChangeRightHandle, this);
    this.model.on("change:tipsy_date",   this._onChangeTipsyDate,   this);

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();

  },

  _showTipsy: function(e) {
    console.log('showing');
    this.$tipsy.fadeIn(150).delay(1500).fadeOut(150);
  },

  _hideTipsy: function(e) {
    this.$tipsy.stop().delay(1500).fadeOut(150);
  },

  _onMouseEnterHandle: function(e) {

    //var $handle = $(e.target);
    //this._updateTipsyPos($handle.position().left + (this.$tipsy.width() / 2));

    //this.$tipsy.stop().fadeIn(150);

  },

  _onMouseLeaveHandle: function(e) {
    if (!this.dragging) this.$tipsy.stop().delay(1000).fadeOut(150);
  },

  _onChangeTipsyDate: function() {
    this.$tipsy.html(this.model.get("tipsy_date"));
  },

  _onChangeLeftHandle: function() {
    var that = this;

    console.log('changing left', this.model.get("left_handle"));

    this.$left_handle.animate({ left: this.model.get("left_handle") }, { duration: 150, easing: "easeOutExpo", complete: function() {
      //that._updateTipsyPos(that.$left_handle.position().left + (that.$tipsy.width() / 2));
    }});
  },

  _onChangeRightHandle: function() {
    var that = this;
    console.log('changing right', this.model.get("right_handle"));

    this.$right_handle.animate({ left: this.model.get("right_handle") }, { duration: 150, easing: "easeOutExpo", complete: function() {
      //that._updateTipsyPos(that.$right_handle.position().left + (that.$tipsy.width() / 2));
    }});
  },

  _updateTipsyPos: function(pos, animated, callback) {

    var that = this;

    if (animated) {

      this.$tipsy.animate({ left: pos + (this.$tipsy.width() / 2) }, { duration: 150, complete: function() {
        that.$tipsy.show();
        callback && callback();
      }});

    } else {

      this.$tipsy.css({ left: pos + (this.$tipsy.width() / 2) });
      this.$tipsy.show();
      callback && callback();

    }

  },

  _enableDrag: function() {

    this.$el.find(".handle").draggable({
      containment: "parent",
      grid: [9, 0],
      axis: "x",
      start: this._onStartDrag,
      drag: this._onDrag,
      stop: this._onStop
    });

  },

  _onStartDrag: function(e) {

    this.dragging = true;

    this.$current_drag     = $(e.target);
    this.current_drag_side = this.$current_drag.hasClass("left") ? "left" : "right";
    this.$tipsy.fadeIn(250);

  },

  _onDrag: function(e) {

    this.dragging = true;

    this.model.set("left_handle",  this.$left_handle.position().left,  { silent: true });
    this.model.set("right_handle", this.$right_handle.position().left, { silent: true });

    var current_handle_pos = this.$current_drag.position().left;

    if ( this.current_drag_side == 'left'  && current_handle_pos + 9 > this.$right_handle.position().left) {
      this.fixPosition = "left";
      return false;
    } else if ( this.current_drag_side == 'right' && current_handle_pos - 9 < this.$left_handle.position().left) {
      this.fixPosition = "right";
      return false;
    }

    var x = this.$current_drag.position().left;
    this._updateTipsyPos(x);
    //this.model.set("tipsy_date", this.months[x]);

    this.$tipsy.html(this.months[x]);

  },

  _onStop: function() {

    var that = this;

    this.dragging = false;

    if (this.fixPosition) {
      if      (this.fixPosition == 'left')  this.model.set("left_handle",  this.model.get("right_handle") - 9*2);
      else if (this.fixPosition == 'right') this.model.set("right_handle", this.model.get("left_handle")  + 9*2);

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
            that.$tipsy.html(that.months[l]);

            that._updateTipsyPos(l, true, function() {
              that._showTipsy();
            });

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
    console.log(year);

    var l = parseInt(this.model.get("left_handle"), 10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var $month = $(e.target).next(".month");
    if (!$month.position()) return; // TODO: add for the last year
    var x = parseInt($month.position().left, 10);

    console.log(x, Math.abs(x-l), Math.abs(x-r));

    if (Math.abs(x - l) <= Math.abs(x - r)) this.model.set("left_handle", x);
    else this.model.set("right_handle", x);

    this.model.set("tipsy_date", year);

    this._updateTipsyPos(x, true, function() {
      that._showTipsy();
    });
  },

  _onClickMonth: function(e){

    e && e.preventDefault();
    e && e.stopPropagation();

    var that = this;

    var date = $(e.target).attr("data-date");

    var l = parseInt(this.model.get("left_handle"), 10);
    var r = parseInt(this.model.get("right_handle"), 10);

    var x = parseInt($(e.target).position().left, 10);

    if (Math.abs(x - l) <= Math.abs(x - r)) this.model.set("left_handle", x);
    else this.model.set("right_handle", x);

    this.model.set("tipsy_date", date);

    this._updateTipsyPos(x, true, function() {
      that._showTipsy();
    });

  },

  _addYears: function() {

    var start = parseInt(this.model.get("startYear"), 10);
    var end   = parseInt(this.model.get("endYear"),   10);

    var yearCount = (end - start);

    var liWidth = 9*12 + 9*4;
    var padding = 9*4  + 20 + 52;

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

    this.$years        = this.$el.find(".years");
    this.$trail        = this.$el.find(".trail");
    this.$tipsy        = this.$el.find(".tipsy");

    this._addYears();

    this.options.container.append(this.$el);

    this._storeDatePositions();
    this._enableDrag();

    this.model.set("left_handle",  _.keys(this.months)[0]);
    this.model.set("right_handle", _.keys(this.months)[_.size(this.months)- 1]);

    return this.$el;

  }

});
