gfw.ui.model.TimelineModis = cdb.core.Model.extend({
  defaults: {
    hidden: true,
  }
});

gfw.ui.view.TimelineModis = gfw.ui.view.Widget.extend({
  className: 'timeline timeline_modis',

  events: {
    'click .quarters li .year': '_onClickYear'
  },

  initialize: function() {
    _.bindAll(this, 'toggle');
    var _year  = '2014',
        _month =  '03';
    if (url('?date')){
      date   = url('?date').split("-");
      _year  = date[0];
      _month = (date[1] < 10) ? '0'+date[1] : date[1];
    }
    this.model = new gfw.ui.model.TimelineModis({
      startYear: 2011,
      endYear: parseInt( (new Date().getUTCFullYear() ), 10),
      year: _year,
      month: _month
    });

    // Bindings
    this.model.on('change:hidden',  this.toggle);
    this.model.on('change:line',    this._onChangeLine, this);

    // Defaults
    this.grid_x = 80;
    this.tipsy_visible = false;

    this.selected_quarter = [this.model.get('year'), this.model.get('month')];

    var template = $("#timeline_modis-template").html();

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

  hide: function() {
    this.model.set('hidden', true);
  },

  updateCoordinates: function() {
    if (this.initialized) this.$coordinates.html('Lat/Long: '+map.getCenter().lat().toFixed(6)+', '+map.getCenter().lng().toFixed(6));
  },

  updateMap: function() {
    publish('timeline:change_date_modis', [this.model.get('month'), this.model.get('year')]);
    Analysis._getAlertCount();
  },

  _onClickYear: function(e){
    e && e.preventDefault();

    var year = $(e.target).attr('data-year'),
        month = $(e.target).attr('data-month');
        quarter = $(e.target).attr('data-quarter');

    if($(e.target).hasClass('active') && (year !== this.model.get('year') || month !== this.model.get('month'))){
      $('.year').removeClass('selected');
      $(e.target).addClass('selected');

      this.$line.find('.tipsy span').html(config.QUARTERNAMES[quarter] + ' ' + year);
      this.model.set('line', $(e.target).position().left + $(e.target).width()/2);

      this.model.set('month', month);
      this.model.set('year', year);

      this.updateMap();
    }
  },

  _onChangeLine: function() {
    if (this.model.get('fadeIn')) {
      $(this.$line).animate({ left: this.model.get('line') }, 150);
    } else {
      this.$line.css('left', this.model.get('line'));

      this.$line.fadeIn();

      this.model.set('fadeIn', true);
    }
  },

  _addYears: function() {
    var start     = this.model.get('startYear'),
        end       = this.model.get('endYear'),
        yearCount = (end - start),
        quarters = 4;

    var padding = 13*2-this.grid_x*5, // first + padding + last
        width   = padding + (yearCount+1)*this.grid_x*quarters - 30;

    this.setWidth(width);
    this.$el.css({
      marginLeft: -width/2,
      left: '50%',
      height: '50px'
    });

    for (var i = 0; i <= yearCount; i++) {
      if (i <= yearCount) {
        for(var j = 0; j < quarters; j++) {
          var quarter = ( ((j+1)*3 <= 9) ? '0' + (j+1)*3 : (j+1)*3 ),
              current_quarter = (j + 1);

          if (!(i === 0 && j < 2) && !(i === yearCount && j > 0)) {
            this.$years.append("<li><a href='#' class='year q"+(start+i)+""+quarter+"' data-year='"+(start+i)+"' data-month='"+quarter+"' data-quarter='"+j+"'>"+(start+i)+" Q"+current_quarter+"</a></li>");
            this.$months.append("<li><div class='interval'></div></li>");
          }
        }
      }
    }
  },

  _init: function() {
    this.$line          = this.$el.find('.line');
    this.$tipsy         = this.$line.find('.tipsy');
    this.$years         = this.$el.find('.quarters');
    this.$months        = this.$el.find('.visible_quarters');
    this.$coordinates   = this.$el.find('.timeline_coordinates');
    $map_coordinates   = this.$el.closest('.map').siblings('.map_coordinates');

    this._addYears();
    this._loadDefaultQuarter();

    this.initialized = true;

    this.updateCoordinates();
    this.updateMap();
  },

  _loadDefaultQuarter: function() {
    var that = this;

    var start = parseInt(this.model.get('startYear'), 10),
        end = parseInt(this.model.get('endYear'), 10);

    var yearCount = (end - start),
        quarters = 4,
        sql = 'SELECT ';

    for(var i = 0; i <= yearCount; i++) {
      for(var j = 1; j <= quarters; j++) {
        var quarter = (j*3 <= 9) ? '0' + j*3 : j*3;

        sql += ['(WITH modis as (SELECT the_geom',
                                'FROM quicc_alerts',
                                'WHERE EXTRACT(YEAR FROM date) = '+(start + i),
                                'AND EXTRACT(MONTH FROM date) = '+quarter,
                                'AND ST_Y(the_geom) < 37) '
               ].join(' ');

        sql += 'SELECT COUNT(*) as q'+(start + i)+''+quarter+' FROM modis)';

        if (i < yearCount || j < quarters) {
          sql += ', ';
        }
      }
    }

    $.getJSON('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), function(data) {
      _.each(data.rows[0], function(value, key) {
        if(value !== 0) {
          $('.'+key).addClass('active');
        }
      });

      var $selected = $('.q'+that.model.get('year')+''+that.model.get('month'));

      if ($selected) {
        $selected.addClass('selected');
        that.model.set('line', $selected.position().left + $selected.width()/2);
        that.$line.find('.tipsy span').html(config.QUARTERNAMES[$selected.attr('data-quarter')] + ' ' + that.model.get('year'));
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
          that.updateMap();
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
