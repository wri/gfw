gfw.ui.model.TimelineForma = cdb.core.Model.extend({
  defaults: {
    hidden: true,
    playing: false,
    animationSpeed: 200,
    animationDelay: 100
  }
});

gfw.ui.view.TimelineForma = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_forma',

  events: {
    'click .action':          '_onClickAction',
    'click .years li .month': '_onClickMonth',
    'click .years li .year':  '_onClickYear',
    'mouseleave .handle':     '_onMouseLeaveHandle'
  },

  initialize: function() {
    _.bindAll(this, '_onStartDrag', 'toggle', '_onDrag', '_onStopDragging', '_animate', '_stopAnimation');

    this.model = new gfw.ui.model.TimelineForma({
      startYear:  2006,
      endYear:    2014,
      line:       null
    });

    this.model.set('play_mode', true);

    // Bindings
    this.model.on('change:hidden',        this.toggle);
    this.model.on('change:line',          this._onChangeLine,  this);
    this.model.on('change:left_handle',   this._onChangeLeftHandle,  this);
    this.model.on('change:right_handle',  this._onChangeRightHandle, this);
    this.model.on('change:play_mode',     this._onChangePlayMode,    this);

    // Defaults
    this.grid_x        = 9;
    this.animationPid  = null;
    this.tipsy_visible = false;
    this.playing       = false;

    this.first_month   = 71; // Numeric value of the first month of the timeline (January 2006)

    this.range_year = [this.model.get('startYear'), this.model.get('endYear') - 1];

    var template = $('#timeline_forma-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();
  },

  show: function() {
    if (Analysis.analyzing) return;

    this.model.set('hidden', false);

    return this;
  },

  hide: function(callback) {
    this.model.set('hidden', true);

    this._stopAnimation();

    return this;
  },

  updateCoordinates: function() {
    if (this.initialized) this.$coordinates.html('Lat/Long: '+map.getCenter().lat()+', '+map.getCenter().lng());
  },

  // Moves line to start position
  _setupLine: function() {
    var line_x = this.model.get('left_handle');

    this.model.set({
      fadeIn: true,
      line: line_x + 9
    });

    this.$line.find('.tipsy span').html(this.years[line_x]);

    this._updateMap('right', line_x);
  },

  _stopAnimation: function() {
    this.playing = false;

    clearTimeout(this.animationPid);

    this.model.set('play_mode', true);
  },

  _animate: function() {
    var that = this;

    if (!this.playing) return;

    clearTimeout(this.animationPid);

    this.animationPid = setTimeout(function() {
      that._animate_action();
      that._loop();
    }, this.model.get('animationSpeed'));
  },

  _loop: function() {
    var that = this;

    setTimeout(function() {
      var x = parseInt(that.model.get('line'), 10);

      that._updateMap('right', x);
      that._animate();
    }, this.model.get('animationDelay'));
  },

  _animate_action: function() {
    var line_x = parseInt(this.model.get('line'), 10);

    if (line_x >= this.model.get('right_handle')) {
      this.model.set('line', line_x + 9);
      this._stopAnimation();
    } else {
      this.model.set('line', line_x + this.grid_x );
    }

    if (this.months[line_x]) {
      this.$line.find('.tipsy span').html(this.months[line_x][0]);
    }

    if (!this.playing) return;
  },

  // Return date array [start_year, start_month, end_year, end_month] for current
  // timline handle positions.
  _getDates: function(side, value) {
    var start_pos, end_pos;

    if (!this.$left_handle || !this.$right_handle) return;

    if (side === 'left') {
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

  _updateMap: function(side, value, options) {
    var dates = this._getDates(side, value);

    if (dates) {
      dates.push(options);

      this.trigger('change_date', dates);
    }
  },


  _onChangePlayMode: function() {
    if (this.model.get('play_mode')) this._pause();
    else this._play();
  },

  _pause: function() {
    var that = this;

    this.playing = false;

    this.$pause.fadeOut(150, function() {
      that.$play.fadeIn(150);
      that._stopAnimation();

      that.$line.delay(1000).fadeOut(150, function() {
        var x = that.model.get('right_handle');
        that._updateMap('right', parseInt(x, 10), { publish: true });
      });
    });  },

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

    this.$left_handle.find('.tipsy').hide(150);
    this.$right_handle.find('.tipsy').hide(150);

    this.model.set('play_mode', !this.model.get('play_mode'));
  },

  _onMouseLeaveHandle: function() {
    var that = this;

    if (!this.$current_drag || !this.tipsy_visible) return;

    if (!this.dragging) this.$current_drag.find(".tipsy").delay(1000).fadeOut(150, function() {
      that.tipsy_visible = false;
    });
  },

  _onChangeLine: function() {
    var that = this;

    $(this.$line).animate({ left: this.model.get('line') }, {
      duration: 150,
      easing: 'easeOutExpo',
      complete: function() {
        if (that.model.get('fadeIn')) {
          that.$line.fadeIn(150);
          that.model.set('fadeIn', false);
        }
      }
    });
  },

  _onChangeLeftHandle: function() {
    $(this.$left_handle).animate({ left: this.model.get('left_handle') }, {
      duration: 100,
      easing: 'easeOutExpo'
    });
  },

  _onChangeRightHandle: function() {
    $(this.$right_handle).animate({ left: this.model.get('right_handle') }, {
      duration: 100,
      easing: 'easeOutExpo'
    });
  },

  _enableDrag: function() {
    var $handle = this.$el.find('.handle');

    $($handle).draggable({
      containment: 'parent',
      grid: [this.grid_x, 0],
      axis: 'x',
      start: this._onStartDrag,
      drag:  this._onDrag,
      stop:  this._onStopDragging
    });
  },

  _onStartDrag: function(e) {
    this.dragging = true;

    this.$current_drag     = $(e.target);
    this.current_drag_side = this.$current_drag.hasClass('left') ? 'left' : 'right';

    this.$current_drag.find('.tipsy').fadeIn(150);

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set('play_mode', true);

      return;
    }
  },

  _onDrag: function() {
    this.dragging = true;

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set('play_mode', true);

      return;
    }

    this.model.set('left_handle',  this.$left_handle.position().left,  { silent: true });
    this.model.set('right_handle', this.$right_handle.position().left, { silent: true });

    var current_handle_pos = this.$current_drag.position().left;

    this.$range.css({
      left: this.model.get('left_handle'),
      width: this.model.get('right_handle') - this.model.get('left_handle')
    });

    var x = this.$current_drag.position().left;

    this._updateRangeYears(x, (this.current_drag_side === 'left'));
    this._updateDate(x);

    if (this.current_drag_side === 'left') this._updateMap('left', x);
    else this._updateMap('right', x);

    if ( this.current_drag_side === 'left' && current_handle_pos + this.grid_x > this.$right_handle.position().left) {
      this.fixPosition = 'left';
      return false;
    } else if ( this.current_drag_side === 'right' && current_handle_pos - this.grid_x < this.$left_handle.position().left) {
      this.fixPosition = 'right';
      return false;
    }
  },

  // Highlights the years inside of the selection
  _highlightYears: function() {
    var min = this.$el.find(".year[data-y=" + this.range_year[0] + "]").parent().index();
    var max = this.$el.find(".year[data-y=" + this.range_year[1] + "]").parent().index();

    if (min == max) {
      this.$el.find(".years .year").removeClass("active");
      return;
    }

    this.$el.find(".years li:gt(" + (min) + "):lt(" + (max) + ") .year").addClass("active");
    this.$el.find(".years li:lt(" + (min + 1) + ") .year, .years li:gt(" + (max) + ") .year").removeClass("active");
  },

  _updateDate: function(x) {
    if (this.months[x]) {
      var date = this.months[x][0];

      this._updateCurrentTipsyDate(date);
      this._highlightYears();

      this.$current_drag && this.$current_drag.find('.tipsy').show();
    }
  },

  _onStopDragging: function() {
    var that = this;

    this.dragging = false;

    if (this.fixPosition) {
      if      (this.fixPosition === 'left')  this.model.set('left_handle',  this.model.get('right_handle') - this.grid_x);
      else if (this.fixPosition === 'right') this.model.set('right_handle', this.model.get('left_handle')  + this.grid_x);

      this.fixPosition = null;
    }

    this.$range.css({
      left: this.model.get('left_handle'),
      width: this.model.get('right_handle') - this.model.get('left_handle')
    });

    this._adjustHandlePosition();

    setTimeout(function() { that.$current_drag.find('.tipsy').fadeOut(150); }, 2000);
  },

  _adjustHandlePosition: function() {
    var x = this.$current_drag.position().left;

    var year = _.find(this.years, function(y) {
      return (x >= (y[0] - 9) && x <= (y[0] + 27 - 9));
    });

    if (year) {
      var $year  = this.$el.find(".year[data-y='"+year[1]+"']");
      var $month = $year.next(".month");

      var month_pos;

      if (!$month.position()) {
        month_pos = _.keys(this.months)[_.size(this.months) - 1];
      } else {
        month_pos = $month.position().left;
      }

      this.model.set(this.current_drag_side + "_handle", month_pos);
      this._updateMap(this.current_drag_side, month_pos, { publish: true });
      this.$current_drag.find(".tipsy span").html(this.months[month_pos][0]);

      if (this.current_drag_side === 'left') {
        this.$line.find(".tipsy span").html(this.months[month_pos][0]);
      } else {
        var width = month_pos - this.$left_handle.position().left;
        this.$range.width(width);
      }

      this._updateRangeYears(month_pos, (this.current_drag_side === 'left'));
      this._highlightYears();
    } else {
      this._updateMap(this.current_drag_side, this.model.get(this.current_drag_side+'_handle'), { publish: true });
    }
  },

  _onClickYear: function(e) {
    e && e.preventDefault();

    var that = this;

    var year = $(e.target).attr('data-y');

    var l = parseInt(this.model.get("left_handle"), 10),
        r = parseInt(this.model.get("right_handle"), 10);

    var $month = $(e.target).next(".month");

    var month_pos;

    if (!$month.position()) {
      month_pos = _.keys(this.months)[_.size(this.months) - 1];
    } else {
      month_pos = $month.position().left;
    }

    var x = parseInt(month_pos, 10),
        left = (Math.abs(x - l) <= Math.abs(x - r));

    if (left) {
      this.$current_drag = this.$left_handle;
      this.model.set("left_handle", x);
      this.$range.css({
        left: x,
        width: this.$right_handle.position().left - x
      });
    } else {
      this.$current_drag = this.$right_handle;
      this.model.set("right_handle", x);
      this.$range.css({
        left: this.$left_handle.position().left,
        width: x - this.$left_handle.position().left
      });
    }

    if (left) this._updateMap("left", x, { publish: true });
    else this._updateMap("right", x, { publish: true });

    this._updateRangeYears(x, left);
    this._highlightYears();
    this._updateTipsy(x, left);

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set("play_mode", true);
    }
  },

  _onClickMonth: function(e) {
    e && e.preventDefault();

    var l = parseInt(this.model.get('left_handle'), 10),
        r = parseInt(this.model.get('right_handle'), 10);

    var x = parseInt($(e.target).position().left, 10);

    // Is it the left handle the closest one to the click?
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    this._updateTipsy(x, left);

    if (left) {
      this.$current_drag = this.$left_handle;
      this.current_drag_side = 'left';
      this.model.set('left_handle', x);
      this.$range.css({
        left: x,
        width: parseInt(this.$right_handle.position().left, 10) - x
      });
    } else {
      this.$current_drag = this.$right_handle;
      this.current_drag_side = 'right';
      this.model.set('right_handle', x);
      this.$range.css({
        left: parseInt(this.$left_handle.position().left, 10),
        width: x - parseInt(this.$left_handle.position().left, 10)
      });
    }

    if (left) this._updateMap("left", x, { publish: true });
    else this._updateMap("right", x, { publish: true });

    this._updateRangeYears(x, left);
    this._updateDate(x);

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set('play_mode', true);
    }
  },

  _updateRangeYears: function(x, left) {
    if (this.months[x]) {
      if (left) this.range_year[0] = this.months[x][2];
      else      this.range_year[1] = this.months[x][2];
    }
  },

  _updateCurrentTipsyDate: function(date) {
    this.$current_drag && this.$current_drag.find('.tipsy span').html(date);
  },

  _updateTipsy: function(x, left_side) {
    if (this.months[x]) {
      if (left_side) {
        this.$right_tipsy.hide();
        this.$left_tipsy.find('span').html(this.months[x][0]);
        this.$line.find('.tipsy span').html(this.months[x][0]);
        this.$left_tipsy.show().delay(2000).fadeOut(250);
      } else {
        this.$left_tipsy.hide();
        this.$right_tipsy.find('span').html(this.months[x][0]);
        this.$right_tipsy.show().delay(2000).fadeOut(250);
      }
    }
  },

  _addYears: function() {
    var start     = parseInt(this.model.get('startYear'), 10),
        end       = parseInt(this.model.get('endYear'),   10),
        yearCount = (end - start);

    var liWidth = this.grid_x*12 + 36,
        padding = 53 + 30 + 13*2, // action + last + handle + padding
        width   = padding + (yearCount)*liWidth;

    this.setWidth(width);
    this.$el.css({ marginLeft: -width/2, left: '50%' });

    var months = '',
        visible_months = '',
        month_names;

    for (var i = 0; i < 12; i++) {
      var month = (i < 9) ? '0' + (i+1) : (i+1),
          month_name = config.MONTHNAMES_SHORT[i];

      months += "<a href='#' class='month' date-m='"+month+"' date-y='year' data-d='"+month_name+"'></a>";
      visible_months += "<div class='month'></div>";
    }

    var currentMonths, active;

    for (var i = 0; i <= yearCount; i++) {
      if (i < yearCount) {
        currentMonths = months.replace(/year/g, start + i)

        if (i > 0) active = ' active';
        else active = '';

        this.$years.append("<li><a href='#' class='year"+active+"' data-y='"+(start+i)+"'>"+(start+i)+"</a>"+currentMonths+"</li>");
        this.$months.append("<li><div class='year'></div>"+visible_months+"</li>");
      } else {
        this.$years.append("<li><a href='#' class='year' data-y='"+(start+i)+"'>"+(start+i)+"</a></li>");
      }
    }
  },

  _storeDatePositions: function() {
    var that = this;

    this.years  = [];
    this.months = {};

    var j    = 0;
    var year = 0;

    _.each(this.$years.find('.year'), function(y, i) {
      // Store year positions
      year = parseInt($(y).attr('data-y'), 10);
      that.years[i] = [$(y).position().left, year];

      // Store month positions
      _.each($(y).parent().find('.month'), function(m) {
        that.months[$(m).position().left] =  [$(m).attr('data-d'), j++, year];
      });
    });
  },

  _init: function() {
    if (this.initialized) return;

    this.$left_handle  = this.$el.find('.handle.left');
    this.$right_handle = this.$el.find('.handle.right');
    this.$line         = this.$el.find('.line');
    this.$left_tipsy   = this.$left_handle.find('.tipsy');
    this.$right_tipsy  = this.$right_handle.find('.tipsy');
    this.$play         = this.$el.find('.action .play');
    this.$pause        = this.$el.find('.action .pause');
    this.$years        = this.$el.find('.years');
    this.$months       = this.$el.find('.visible_months');
    this.$trail        = this.$el.find('.trail');
    this.$coordinates  = this.$el.find('.timeline_coordinates');
    this.$range        = this.$el.find('.range');

    this._addYears();
    this._storeDatePositions();
    this._enableDrag();

    var left_handle_x  = 27,
        right_handle_x = parseInt(_.keys(this.months)[_.size(this.months)- 1], 10);

    this.model.set('left_handle',  left_handle_x);
    this.model.set('right_handle', right_handle_x);

    if (this.months[left_handle_x]) {
      this.$line.find('.tipsy span').html(this.months[left_handle_x][0]);
    }

    this.$range.css({
      left: this.model.get('left_handle'),
      width: this.model.get('right_handle') - this.model.get('left_handle')
    });

    this.initialized = true;

    this.updateCoordinates();
  },

  toggle: function() {
    var that = this;

    if (this.model.get('hidden')) {
      this.$el.fadeOut(200);
    } else {
      this.$el.fadeIn(200, function() {
        that._init();
        that._updateMap('right', that.model.get('right_handle'), { publish: true });
      });
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));
    return this.$el;
  }
});
