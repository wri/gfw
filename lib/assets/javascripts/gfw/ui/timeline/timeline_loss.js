gfw.ui.model.TimelineLoss = cdb.core.Model.extend({
  defaults: {
    hidden: true,
    playing: false,
    animationSpeed: 200,
    animationDelay: 100
  }
});

gfw.ui.view.TimelineLoss = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_loss',

  events: {
    'click .action':          '_onClickAction',
    'click .years li .year':  '_onClickYear',
    'mouseleave .handle':     '_onMouseLeaveHandle'
  },

  initialize: function() {
    _.bindAll(this, '_onStartDrag', 'toggle', '_onDrag', '_onStopDragging', '_animate', '_stopAnimation');

    this.model = new gfw.ui.model.TimelineLoss({
      startYear:  2001,
      endYear:    2013,
      line:       null
    });

    this.model.set('play_mode', true);

    // Bindings
    this.model.on('change:hidden', this.toggle);
    this.model.on('change:line', this._onChangeLine, this);
    this.model.on('change:left_handle', this._onChangeLeftHandle, this);
    this.model.on('change:right_handle', this._onChangeRightHandle, this);
    this.model.on('change:play_mode', this._onChangePlayMode, this);

    // Defaults
    this.grid_x = 80;
    this.animationPid = null;
    this.playing = false;
    this.stopped = false;

    this.range_year = [this.model.get('startYear'), this.model.get('endYear')];

    var template = $('#timeline_loss-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  show: function() {
    this.model.set('hidden', false);

    if (this.$el.hasClass('visibility_hidden')) this.$el.removeClass('visibility_hidden');
    if (typeof $map_coordinates !== 'undefined') $map_coordinates.hide()
  },

  hide: function(_show_gain) {
    if (_show_gain) {
      //this is used to display coordinates when only gain layer or none layer are loaded.
      this.$el.addClass('visibility_hidden');
      if (typeof $map_coordinates !== 'undefined') $map_coordinates.show();
    } else {
      this.model.set('hidden', true);
    }
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
    var date = [this.range_year[0], this.range_year[1], options],
        hash = '&begin=' + this.range_year[0] + '&end=' + this.range_year[1];

    publish('timeline:change_date_loss', date);
    if (!this.playing){
      Analysis._getAlertCount();
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
    });
    this.stopped = true;
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

    if (this.playing || this.stopped) {
      this.$line.fadeOut(150);
      this._stopAnimation();
      this.model.set('play_mode', true);
      this.stopped = false;

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
    var min = this.$el.find('.year[data-year=' + this.range_year[0] + ']').parent().index();
    var max = this.$el.find('.year[data-year=' + this.range_year[1] + ']').parent().index();

    if (min === max) {
      this.$el.find('.years .year').removeClass('active');
      return;
    }

    this.$el.find('.years li:gt(' + (min) + '):lt(' + (max) + ') .year').addClass('active');
    this.$el.find('.years li:lt(' + (min + 1) + ') .year, .years li:gt(' + (max) + ') .year').removeClass('active');
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

    this._adjustHandlePosition();

    setTimeout(function() {
      var real_diff  = parseInt(that.$right_handle.css('left'), 10) - parseInt(that.$left_handle.css('left'),10),
          range_diff = that.model.get('right_handle') - that.model.get('left_handle');

      if(real_diff !== range_diff){
        that.$range.css({
          left: that.$left_handle.css('left'),
          width: real_diff
        });

        //This gives the year from the left and from the right when we input the position: 30px from the left --> year 2001.
        //(position + year 2001 (first year) - 30 (tipsy width) ) / 80 (year width) + 1975 (fill the gap)
        var year_left  = (parseInt(that.$left_handle.css('left'), 10) + 2001 - 30) / 80 + 1975,
            year_right = (parseInt(that.$right_handle.css('left'),10) + 2001 - 30) / 80 + 1975;

        $.each(that.$years.find('li .year'), function(i, el){
          $(el).removeClass('active')
          if ($(el).data('year') > year_left && $(el).data('year') <= year_right) {
            $(el).addClass('active')
          }
        });
      }

      that.$current_drag.find('.tipsy').fadeOut(150);
    }, 1500);
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

  _addYears: function() {
    var start     = this.model.get('startYear'),
        end       = this.model.get('endYear'),
        yearCount = (end - start);

    var padding = 53 + 30 + 14 + 13*2, // action + last + handle + padding
        width   = padding + (yearCount)*this.grid_x;

    this.setWidth(width);
    this.$el.css({ marginLeft: -width/2, left: '50%' });

    for (var i = 0; i <= yearCount; i++) {
      if (i <= yearCount) {
        if (i > 0) {
          active = ' active';
        } else {
          active = '';
        }

        this.$years.append("<li><a href='#' class='year"+active+"' data-year='"+(start+i)+"'>"+(start+i)+"</a></li>");
        this.$months.append("<li><div class='interval'></div></li>");
      } else {
        this.$years.append("<li><a href='#' class='year active' data-year='"+(start+i)+"'>"+(start+i)+"</a></li>");
      }
    }
  },

  _storeDatePositions: function() {
    var that = this;

    this.years  = {};

    var year = 0;

    // Store year positions
    _.each(this.$years.find('.year'), function(y, i) {
      year = parseInt($(y).attr('data-year'), 10);
      that.years[parseInt($(y).position().left, 10)+30] = year;
    });
  },

  _init: function() {
    this.$left_handle  = this.$el.find('.handle.left');
    this.$right_handle = this.$el.find('.handle.right');
    this.$line         = this.$el.find('.line');
    this.$left_tipsy   = this.$left_handle.find('.tipsy');
    this.$right_tipsy  = this.$right_handle.find('.tipsy');
    this.$play         = this.$el.find('.action .play');
    this.$pause        = this.$el.find('.action .pause');
    this.$years        = this.$el.find('.years');
    this.$months       = this.$el.find('.visible_years');
    this.$trail        = this.$el.find('.trail');
    this.$coordinates  = this.$el.find('.timeline_coordinates');
    this.$range        = this.$el.find('.range');
    $map_coordinates   = this.$el.closest('.map').siblings('.map_coordinates')

    this._addYears();
    this._storeDatePositions();
    this._enableDrag();

    var left_handle_x,
        right_handle_x;

    if (url('?begin') && url('?end') && url('?begin').length < 4 && url('?end').length < 4) {
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
          that._init();
        }
      });
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));
    return this.$el;
  }
});