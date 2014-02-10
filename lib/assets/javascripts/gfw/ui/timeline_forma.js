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

  },

  _stopAnimation: function() {

  },

  _animate: function() {

  },

  _loop: function() {

  },

  _animate_action: function() {

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

  _updateMap: function(side, value) {
    var dates = this._getDates(side, value);

    if (dates) {
      this.trigger('change_date', dates[1], dates[3], dates[2]);
    }
  },


  _onChangePlayMode: function() {

  },

  _pause: function() {

  },

  _play: function() {

  },

  _onClickAction: function(e) {
    e.preventDefault();

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
    var min = this.$el.find(".year[data-y='"+this.range_year[0]+"']").parent().index();
    var max = this.$el.find(".year[data-y='"+this.range_year[1]+"']").parent().index();

    if (min == max) {
      this.$el.find('.years .year').removeClass('active');
      return;
    }

    this.$el.find('.years li:gt('+(min)+'):lt('+(max)+').year').addClass('active');
    this.$el.find('.years li:lt('+(min+1)+').year, .years li:gt('+(max)+') .year').removeClass('active');
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

  },

  _onClickYear: function(e) {

  },

  _onClickMonth: function(e) {
    e && e.preventDefault();

    var l = parseInt(this.model.get('left_handle'), 10),
        r = parseInt(this.model.get('right_handle'), 10);

    var x = parseInt($(e.target).position().left, 10);

    // Is it the left handle the closest one to the click?
    var left = (Math.abs(x - l) <= Math.abs(x - r));

    var left_pos,
        width;

    if (left) {
      this.$current_drag = this.$left_handle;
      this.model.set('left_handle', x);
      left_pos = x + this.grid_x;
      width    = this.$right_handle.position().left - x - this.grid_x;
    } else {
      this.$current_drag = this.$right_handle;
      this.model.set('right_handle', x);
      left_pos = this.$left_handle.position().left + this.grid_x;
      width    = x - this.$left_handle.position().left - this.grid_x;
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

    this.$range.fadeIn(250);

    this.initialized = true;
  },

  toggle: function() {
    var that = this;

    if (this.model.get('hidden')) {
      this.$el.fadeOut(200);
    } else {
      this.$el.fadeIn(200, function() {
        that.updateCoordinates();
        that._init();
      });
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));
    return this.$el;
  }
});
