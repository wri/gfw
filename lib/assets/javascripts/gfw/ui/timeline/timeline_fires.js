gfw.ui.model.TimelineFires = cdb.core.Model.extend({
  defaults: {
    hidden: true,
    playing: false,
    animationSpeed: 400,
    animationDelay: 200
  }
});

gfw.ui.view.TimelineFires = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_fires',

  events: {
    'click .action':       '_onClickAction',
    'click .days li .day': '_onClickYear',
    'mouseleave .handle':  '_onMouseLeaveHandle'
  },

  initialize: function() {
    _.bindAll(this, '_onStartDrag', 'toggle', '_onDrag', '_onStopDragging', '_animate', '_stopAnimation');

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.TimelineFires({
      line: null
    });

    this.model.set('play_mode', true);

    // Bindings
    this.model.on('change:hidden',        this.toggle);
    this.model.on('change:line',          this._onChangeLine,         this);
    this.model.on('change:left_handle',   this._onChangeLeftHandle,   this);
    this.model.on('change:right_handle',  this._onChangeRightHandle,  this);
    this.model.on('change:play_mode',     this._onChangePlayMode,     this);

    // Defaults
    this.grid_x         = 80;
    this.animationPid   = null;
    this.playing        = false;

    this.range_year = [];

    var template = $('#timeline_fires-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  show: function() {
    this.model.set('hidden', false);
  },

  hide: function() {
    this.model.set('hidden', true);

    this._stopAnimation();
  },

  updateCoordinates: function() {
    if (this.initialized) this.$coordinates.html('Lat/Long: '+map.getCenter().lat().toFixed(6)+', '+map.getCenter().lng().toFixed(6));
  },

  // Moves line to start position
  _setupLine: function() {
    var line_x = this.model.get('left_handle');

    this.model.set({
      fadeIn: true,
      line: line_x + 7
    });

    this._updateRangeYears(line_x);
    this.$line.find('.tipsy span').html(this.years[line_x]);

    this.updateMap();
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
      that.updateMap();

      that._animate();
    }, this.model.get('animationDelay'));
  },

  _animate_action: function() {
    var line_x = parseInt(this.model.get('line'), 10);

    if (line_x+73 === this.model.get('right_handle')) { // one year
      this._updateRangeYears(line_x+73);
      this.model.set('line', line_x+80 );
      this.$line.find('.tipsy span').html(this.years[line_x+73]);

      this.updateMap();

      this._stopAnimation();
    } else {
      if (line_x === this.model.get('left_handle') + 7) { // first year
        this._updateRangeYears(line_x+73);
        this.model.set('line', line_x+59 );
        this.$line.find('.tipsy span').html(this.years[line_x+73]);
      } else if (line_x+94 === this.model.get('right_handle')) { // last year
        this._updateRangeYears(line_x+94);
        this.model.set('line', line_x+101 );
        this.$line.find('.tipsy span').html(this.years[line_x+94]);

        this.updateMap();

        this._stopAnimation();
      } else {
        this._updateRangeYears(line_x+94);
        this.model.set('line', line_x+80 );
        this.$line.find('.tipsy span').html(this.years[line_x+94]);
      }
    }

    if (!this.playing) return;
  },

  updateMap: function(options) {
    var date = [this.range_year[0], this.range_year[1], options];

    publish('timeline:change_date_fires', date);
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
        that.updateMap();
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

    this.$left_handle.find('.tipsy').hide(150);
    this.$right_handle.find('.tipsy').hide(150);

    this.model.set('play_mode', !this.model.get('play_mode'));
  },

  _onMouseLeaveHandle: function() {
    this.$current_drag && this.$current_drag.find('.tipsy').delay(1000).fadeOut(150);
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

    this.updateMap();

    if ( this.current_drag_side === 'left' && current_handle_pos + this.grid_x > this.$right_handle.position().left) {
      this.fixPosition = 'left';
      return;
    } else if ( this.current_drag_side === 'right' && current_handle_pos - this.grid_x < this.$left_handle.position().left) {
      this.fixPosition = 'right';
      return;
    }
  },

  // Highlights the years inside of the selection
  _highlightYears: function() {
    var min = this.$el.find('.day[data-day=' + this.range_year[0] + ']').parent().index();
    var max = this.$el.find('.day[data-day=' + this.range_year[1] + ']').parent().index();

    if (min === max) {
      this.$el.find('.days .day').removeClass('active');
      return;
    }

    this.$el.find('.days li:gt(' + (min) + '):lt(' + (max) + ') .day').addClass('active');
    this.$el.find('.days li:lt(' + (min + 1) + ') .day, .days li:gt(' + (max) + ') .day').removeClass('active');
  },

  _updateDate: function(x) {
    var date = this.years[x];

    this._updateCurrentTipsyDate(date);
    this._highlightYears();

    this.$current_drag && this.$current_drag.find('.tipsy').show();
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
    var pos = this.model.get(this.current_drag_side + '_handle');

    this._updateRangeYears(pos, (this.current_drag_side === 'left'));
    this._updateDate(pos);

    this.updateMap({ publish: true });
  },

  _onClickYear: function(e) {
    e && e.preventDefault();

    var l = parseInt(this.model.get('left_handle'), 10),
        r = parseInt(this.model.get('right_handle'), 10);

    var x = parseInt($(e.target).position().left, 10) + 30;

    var left = (Math.abs(x - l) <= Math.abs(x - r));

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

    this._updateTipsy(x, left);

    this._adjustHandlePosition();

    if (this.playing) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set('play_mode', true);
    }
  },

  _updateRangeYears: function(x, left) {
    if (this.years[x]) {
      if (left) this.range_year[0] = this.years[x];
      else      this.range_year[1] = this.years[x];
    }
  },

  _updateCurrentTipsyDate: function(date) {
    this.$current_drag && this.$current_drag.find('.tipsy span').html(date);
  },

  _updateTipsy: function(x, left) {
    if (left) {
      this.$right_tipsy.hide();
      this.$left_tipsy.find('span').html(this.years[x]);
      this.$line.find('.tipsy span').html(this.years[x]);
      this.$left_tipsy.show().delay(2000).fadeOut(150);
    } else {
      this.$left_tipsy.hide();
      this.$right_tipsy.find('span').html(this.years[x]);
      this.$right_tipsy.show().delay(2000).fadeOut(150);
    }
  },

  _addDays: function(days) {
    var dayCount = days['total_rows'];

    this.model.set('startDay', days['rows'][0]['acq_date']);
    this.model.set('endDay', days['rows'][dayCount-1]['acq_date']);

    this.years  = {};

    var start = this.model.get('startDay'),
        end = this.model.get('endDay');

    this.range_year[0] = start.split('-')[1]+'-'+start.split('-')[2]+'-'+start.split('-')[0];

    var padding = 30 + 14 + 13*2, // last + handle + padding
        width = padding + (dayCount)*this.grid_x;

    this.setWidth(width);
    this.$el.css({ marginLeft: -width/2, left: '50%' });

    for (var i = 0; i <= (dayCount); i++) {
      if (i < dayCount) {
        if (i > 0) {
          active = ' active';
        } else {
          active = '';
        }

        var date = new Date(days['rows'][i]['acq_date']),
            date_ = ('0' + (date.getUTCMonth()+1)).slice(-2)+'-'+date.getDate()+'-'+date.getUTCFullYear();

        this.$days.append("<li><a href='#' class='day"+active+"' data-day='"+date_+"'>"+date_.split('-')[0]+"-"+date_.split('-')[1]+"<br />"+date_.split('-')[2]+"</a></li>");
        this.$months.append("<li><div class='interval'></div></li>");v
      } else {
        var date = new Date(days['rows'][i-1]['acq_date']);
        date.setDate(date.getDate() + 1);

        var date_ = ('0' + (date.getUTCMonth()+1)).slice(-2)+'-'+date.getDate()+'-'+date.getUTCFullYear();

        this.range_year[1] = ('0' + (date.getUTCMonth()+1)).slice(-2)+'-'+date.getDate()+'-'+date.getUTCFullYear();

        this.$days.append("<li><a href='#' class='day active' data-day='"+date_+"'>"+date_.split('-')[0]+"-"+date_.split('-')[1]+"<br />"+date_.split('-')[2]+"</a></li>");
        this.$months.append("<li><div class='interval'></div></li>");
      }
    }
  },

  _storeDatePositions: function() {
    var that = this;

    this.years  = {};

    var day = 0;

    // Store year positions
    _.each(this.$days.find('.day'), function(y, i) {
      day = $(y).attr('data-day');
      that.years[parseInt($(y).position().left, 10)+30] = day;
    });
  },

  _getDays: function(callback) {
    var that = this;

    var sql = ["WITH dates as (SELECT to_date(acq_date, 'YYYY-MM-DD') as acq_date_proc, acq_date",
              'FROM global_7d)',
              'SELECT DISTINCT ON (acq_date_proc) acq_date_proc, acq_date',
              'FROM dates',
              'ORDER BY acq_date_proc ASC'].join(' ');

    $.getJSON('http://wri-01.cartodb.com/api/v2/sql/?q='+sql, function(data) {
      that._init(data);
    });
  },

  _init: function(days) {
    this.$left_handle  = this.$el.find('.handle.left');
    this.$right_handle = this.$el.find('.handle.right');
    this.$line         = this.$el.find('.line');
    this.$left_tipsy   = this.$left_handle.find('.tipsy');
    this.$right_tipsy  = this.$right_handle.find('.tipsy');
    this.$play         = this.$el.find('.action .play');
    this.$pause        = this.$el.find('.action .pause');
    this.$days         = this.$el.find('.days');
    this.$months       = this.$el.find('.visible_days');
    this.$trail        = this.$el.find('.trail');
    this.$coordinates  = this.$el.find('.timeline_coordinates');
    this.$range        = this.$el.find('.range');

    this._addDays(days);
    this._storeDatePositions();
    this._enableDrag();

    var left_handle_x,
        right_handle_x;

    if (url('?begin') && url('?end')) {
      this.range_year[0] = _.find(this.years, function(year) {
        return year == url('?begin');
      });

      _.each(this.years, function(year, pos) {
        if (year == url('?begin')) left_handle_x = parseInt(pos, 10);
      });

      this.range_year[1] = _.find(this.years, function(year) {
        return year == url('?end');
      });

      _.each(this.years, function(year, pos) {
        if (year == url('?end')) right_handle_x = parseInt(pos, 10);
      });

      this._highlightYears();
    } else {
      left_handle_x = 30;
      right_handle_x = parseInt(_.keys(this.years)[_.size(this.years)-1], 10);
    }

    this.model.set('left_handle', left_handle_x);
    this.model.set('right_handle', right_handle_x);

    this.$line.find('.tipsy span').html(this.years[left_handle_x]);

    this.$range.css({
      left: this.model.get('left_handle'),
      width: this.model.get('right_handle') - this.model.get('left_handle')
    });

    this.initialized = true;

    this.updateCoordinates();
    this.updateMap({ publish: true });
  },

  toggle: function() {
    var that = this;

    if (this.model.get('hidden')) {
      if(this.$el.is(':visible')) {
        this.$el.fadeOut(200);
      } else {
        this.$el.hide();
      }
    } else {
      $(this.$el).fadeIn(200, function() {
        if (that.initialized) {
          that.updateMap({ publish: true });
        } else {
          that._getDays();
        }
      });
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));
    return this.$el;
  }
});
