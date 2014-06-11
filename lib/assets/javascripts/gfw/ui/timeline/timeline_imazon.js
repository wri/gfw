gfw.ui.model.TimelineImazon = cdb.core.Model.extend({
  defaults: {
    hidden: true
  }
});

gfw.ui.view.TimelineImazon = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_imazon',

  events: {
    'click .years li .month': '_onClickMonth',
    'click .years li .year':  '_onClickYear',
    'mouseleave .handle':     '_onMouseLeaveHandle'
  },

  initialize: function() {
    _.bindAll(this, '_onStartDrag', 'toggle', '_onDrag', '_onStopDragging');

    this.model = new gfw.ui.model.TimelineImazon({
      startYear:  2007,
      endYear:    parseInt( (new Date().getUTCFullYear() ), 10) +1
    });

    // Bindings
    this.model.on('change:hidden',       this.toggle);
    this.model.on('change:left_handle',  this._onChangeLeftHandle,  this);
    this.model.on('change:right_handle', this._onChangeRightHandle, this);

    // Defaults
    this.grid_x        = 6;
    this.tipsy_visible = false;
    this.first_month   = 71; // Numeric value of the first month of the timeline (January 2006)
    this.range_year    = [this.model.get('startYear'), this.model.get('endYear')];

    var template = $('#timeline_imazon-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  show: function() {
    if (Analysis.analyzing) return;

    this.model.set('hidden', false);
    if (typeof $map_coordinates !== 'undefined') $map_coordinates.hide();
  },

  hide: function(callback) {
    this.model.set('hidden', true);
  },

  updateCoordinates: function() {
    if (this.initialized) this.$coordinates.html('Lat/Long: '+map.getCenter().lat().toFixed(6)+', '+map.getCenter().lng().toFixed(6));
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

  _updateMap: function(side, value, options) {
    var dates = this._getDates(side, value);

    if (dates) {
      if (options)
        publish('timeline:change_date_imazon', [dates[0], ((dates[1]-71)%12)+1, dates[2], ((dates[3]-71)%12)+1, options]);
    
      Analysis._getAlertCount();
    }
  },

  _onMouseLeaveHandle: function() {
    var that = this;

    if (!this.$current_drag || !this.tipsy_visible) return;

    if (!this.dragging) this.$current_drag.find(".tipsy").delay(1000).fadeOut(150, function() {
      that.tipsy_visible = false;
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
  },

  _onDrag: function() {
    this.dragging = true;

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

    if (this.model.get('right_handle') > this.max_distance) {
      this.model.set('right_handle', this.max_distance)
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
      return (x >= y[0] && x <= (y[0] + 27));
    });


    if (year) {
      var orig_year = year[1] + 1;
      if (orig_year > this.range_year[1]) year[1] = this.range_year[1];

      var $year  = this.$el.find(".year[data-y='"+year[1]+"']");
      var $month = $year.next(".month");

      var month_pos;

      if (!$month.position()) {
        month_pos = _.keys(this.months)[_.size(this.months) - 1];
      } else {
        month_pos = $month.position().left;
        if (orig_year > this.range_year[1]) month_pos = this.max_distance;
      }
      this.model.set(this.current_drag_side + "_handle", month_pos);
      this._updateMap(this.current_drag_side, month_pos, { publish: true });
      this.$current_drag.find(".tipsy span").html(this.months[month_pos][0]);

      if (!this.current_drag_side === 'left') {
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

    if (year > this.range_year[1] || this.range_year[1] == undefined) {
      month_pos = this.max_distance;
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
  },

  _onClickMonth: function(e) {
    e && e.preventDefault();

    var l = parseInt(this.model.get('left_handle'), 10),
        r = parseInt(this.model.get('right_handle'), 10);

    var x = parseInt($(e.target).position().left, 10);

    x = (x > this.max_distance) ? this.max_distance : x;

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
        padding = 30 + 13*2, // action + last + handle + padding
        width   = padding + (yearCount)*liWidth;

    this.setWidth(width);
    this.$el.css({ marginLeft: -width/2, left: '50%', height: '50px' });

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
    this.$left_handle  = this.$el.find('.handle.left');
    this.$right_handle = this.$el.find('.handle.right');
    this.$left_tipsy   = this.$left_handle.find('.tipsy');
    this.$right_tipsy  = this.$right_handle.find('.tipsy');
    this.$years        = this.$el.find('.years');
    this.$months       = this.$el.find('.visible_months');
    this.$trail        = this.$el.find('.trail');
    this.$coordinates  = this.$el.find('.timeline_coordinates');
    this.$range        = this.$el.find('.range');
    $map_coordinates   = this.$el.closest('.map').siblings('.map_coordinates');

    this._addYears();
    this._storeDatePositions();
    this._enableDrag();

    this.max_month_imazon = 0;
    this.max_distance = 0;
    this._getMaxImazonMonth();
},

  init_imazon: function(){
    var left_handle_x,
        right_handle_x;

    if (url('?begin') && url('?end') && url('?begin').length > 6 && url('?end').length > 6) {
      var begin = url('?begin').split('-'),
          end   = url('?end').split('-'),
          month_begin = (begin[0].substr(2,4) - 1) * 12 + parseInt(begin[1], 10),
          month_end   =   (end[0].substr(2,4) - 1) * 12 + parseInt(end[1], 10);
      //month_begin & month_end: number of month from Jan. 2000 to the date (Jan. 2006 is the min: 73 months)
      
      this.range_year[0] = _.find(this.months, function(month) {
        return month == begin[0];
      });
      
      this.range_year[1] = _.find(this.months, function(month) {
        return month == end[0];
      });

      _.each(this.months, function(month, pos) {
        if (month[1] == month_begin - 73) left_handle_x = parseInt(pos, 10);
        if (month[1] == month_end - 73) right_handle_x = parseInt(pos, 10);
      });


      this._highlightYears();
    } else {
      this.max_month_imazon = (this.max_month_imazon === 0) ? month -2 : (this.max_month_imazon < 10) ? '0' + this.max_month_imazon : this.max_month_imazon;
      right_handle_x = this.max_distance;
      this._updateMap('right', right_handle_x, { publish: true });
      left_handle_x  = 27;
    }
    this.model.set('left_handle',  left_handle_x);
    this.model.set('right_handle', right_handle_x);

    this.$range.css({
      left: this.model.get('left_handle'),
      width: this.model.get('right_handle') - this.model.get('left_handle')
    });

    this.initialized = true;

    this.updateCoordinates();
    
    if (url('?begin') && url('?end') && url('?begin').length > 6 && url('?end').length > 6) {
      this._updateMap('right', this.model.get('right_handle'));
    } else {
      this._updateMap('right', this.model.get('right_handle'), { publish: true });
    }
  },

  _getMaxImazonMonth: function() {
    that = this;
    var query = 'https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20MAX%20(date)%20FROM%20imazon_clean2';

    $.ajax({
      url: query,
      success: function(data) {
        that.max_month_imazon = parseInt(data.rows[0].max.split('-')[1]);
        that.max_distance = ((7 * 108) + 14 + that.max_month_imazon * 8) - 1;
        that.init_imazon();
        return that.max_month_imazon;
      },
      error: function() {
        console.log('api error')
        return 0;
      }
    });
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
      this.$el.fadeIn(200, function() {
        if (that.initialized) {
          that._updateMap('right', that.model.get('right_handle'), { publish: true });
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
