/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'moment',
  'd3',
  'mps',
  'handlebars',
  'enquire',
  'text!templates/timelineYear.handlebars',
  'text!templates/timelineMonth-mobile.handlebars'

], function(_, Backbone, moment, d3, mps, Handlebars, enquire, tpl, tplMobile) {

  'use strict';

  var TimelineYearClass = Backbone.View.extend({

    className: 'timeline-month',

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    months: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC",],

    defaults: {
      dateRange: [moment([2001]), moment()],
      width: 750,
      height: 50,
      player: true,
      playSpeed: 400,
      effectsSpeed: 0
    },

    events: {
      'click .play': '_togglePlay',
      'change .select-date' : 'setSelects'
    },

    initialize: function(layer, currentDate) {
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});
      this.dateRangeStart = this.options.dateRange[0];
      this.dateRangeEnd = this.options.dateRange[1];

      if (currentDate && currentDate[0]) {
        this.currentDate = currentDate;
      } else {
        this._updateCurrentDate(this.options.dateRange);
      }

      // Transitions duration are 100 ms. Give time to them to finish.
      this._updateCurrentDate = _.debounce(this._updateCurrentDate,
        this.options.effectsSpeed);
      this.playing = false;

      // Max date range
      this.drMax = this.options.dateRange.map(function(dr) { return moment(dr); });
      // Date range
      this.dr = [[moment(this.drMax[0]).year()], [moment(this.drMax[1]).year() + 1]];

      // Number months to display
      this.monthsCount = Math.floor(moment(this.dr[1]).diff(moment(this.dr[0]),
        'months', true));

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.renderMobile();
        },this)
      });
    },


    /**
     * Render select of years.
     */
    renderMobile: function(){
      this.$timeline = $('.timeline-container');
      this.$el.html(this.templateMobile({name: this.layer.title}));
      this.$timeline.html('').append(this.el);

      // Cache
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');

      // Timeline
      this.$selects = $('.select-date');
      this.$selectsYear = $('.select-date-year');
      this.$selectsMonth = $('.select-date-month');
      this.$fromMonth = $('#from-timeline-month');
      this.$from = $('#from-timeline-year');
      this.$toMonth = $('#to-timeline-month');
      this.$to = $('#to-timeline-year');


      this.fillSelects();
    },

    fillSelects: function() {
      if (! !!this.dateRangeStart._d) {
        this.dateRangeStart = moment(this.dateRangeStart);
        this.dateRangeEnd   = moment(this.dateRangeEnd);
        this.currentDate[0] = moment(this.currentDate[0]);
        this.currentDate[1] = moment(this.currentDate[1]);
      }
      var start = this.dateRangeStart.year(),
          end   = this.dateRangeEnd.year(),
          range = end - start + 1,
          options = '';
      for (var i = 0; i < range; i++) {
        options += '<option value="'+(start + i)+'">'+ (start + i) +'</option>';
      }
      // Year Selects
      this.$from.html(options).val(this.currentDate[0].year());
      this.$to.html(options).val(this.currentDate[1].year());

      // Month Selects
      this.$fromMonth.val(this.months[this.currentDate[0].month()]);
      this.$toMonth.val(this.months[this.currentDate[1].month()]);

      this.setSelects();
    },

    setSelects: function(){
      _.each(this.$selects,function(el){
        var date = $(el).val();
        var $dateButton = $('#'+$(el).attr('id')+'-button');
        $dateButton.text(date);
      });
      this.toggleDisabled();

    },

    toggleDisabled: function(){
      _.each(this.$selectsYear,function(el){
        var $options = document.getElementById($(el).attr('id')).options;
        var compare = $($(el).data('compare'))[0].selectedIndex;
        var direction = Boolean(parseInt($(el).data('direction')));

        _.each($options, function(opt,i){
          if (direction) {
            (compare <= i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          } else {
            (compare >= i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          }
        });
      });

      _.each(this.$selectsMonth,_.bind(function(el){
        var $options = document.getElementById($(el).attr('id')).options;
        var yearSelect = $('#'+$(el).attr('id').replace('month','year')).val();
        var monthSelect = $(el)[0].selectedIndex;
        var start = this.dateRangeStart.year();
        var end = this.dateRangeEnd.year();
        var endMonth = this.dateRangeEnd.month();
        if (yearSelect == end) {
          // if you select the last year of the timeslider we have to check if all months are avaible
          _.each($options, function(opt,i){
            (i > endMonth) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          });
          // if previously we have selected a month that is not avaible we must select manually the last month
          if (monthSelect > endMonth) {
            $(el).val(this.months[endMonth]);
            this.setSelects();
          }
        }else{
          _.each($options, function(opt,i){
            $(opt).prop('disabled',false);
          });
        }
      }, this ));


      var start = moment(this.prepareDate(this.$fromMonth[0].selectedIndex ,this.$from.val()));
      var end   = moment(this.prepareDate(this.$toMonth[0].selectedIndex ,this.$to.val()));

      this._updateCurrentDate([start, end]);
    },


    prepareDate: function(month, year){
      return [year, month];
    },


    render: function() {
      _.bindAll(this, '_moveHandler');
      var self = this;
      this.$timeline = $('.timeline-container');
      this.$el.html(this.template());
      this.$timeline.append(this.el);

      // Cache
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');

      // Disable player if needed
      if (!this.options.player) {
        // 50 is the play div width.
        this.options.width += 50;
        this.$play.addClass('hidden');
        this.$play.parent().addClass('no-play');
      }

      // SVG options
      var margin = {top: 0, right: 20, bottom: 0, left: 20};
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.bottom - margin.top;

      // xscale
      this.xscale = d3.scale.linear()
          .domain([0, this.monthsCount])
          .range([0, width])
          .clamp(true);

      // SVG
      this.svg = d3.select(this.$time[0])
          .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('style','width:'+ (width + margin.left + margin.right) +'px;')
          .append('g')
            .attr('transform', 'translate({0},{1})'.format(margin.left, margin.top));

      // Dots xaxis
      this.svg.append('g')
          .attr('class', 'xaxis')
          .attr('transform', 'translate(0,{0})'.format(height/2 - 3))
          .call(d3.svg.axis()
            .scale(this.xscale)
            .orient('top')
            .ticks(this.monthsCount)
            .tickFormat(function() {
              return '▪';
            })
            .tickSize(0)
            .tickPadding(0))
          .select('.domain').remove();

      this.svg.selectAll('.tick').filter(function(d) {
        if (moment(self._domainToDate(d)).month() === 0) {
          d3.select(this).classed('highlight', true);
        }
      });

      this.svg.select('.xaxis').selectAll('g.line').remove();

      // Years xscale
      this.yearsXscale = d3.time.scale()
          .domain([moment(this.dr[0]).toDate(), moment(this.dr[1]).toDate()])
          .range([0, width]);

      // Years xaxis
      var xAxis = d3.svg.axis()
          .scale(this.yearsXscale)
          .orient('bottom')
          .ticks(d3.time.years)
          .tickSize(0)
          .tickPadding(0)
          .tickFormat(d3.time.format('%Y'));

      this.svg.append('g')
          .attr('class', 'xaxis-years')
          .attr('transform', 'translate({0},{1})'.format(0, height/2 + 6))
          .call(xAxis)
        .select('.domain').remove();

      // this.svg.selectAll('.xaxis-years .tick:last-child text').attr('x', -15);

      // Set brush and listeners.
      this.brush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on('brush', function() {
            self._onBrush(this);
          })
          .on('brushend', function() {
            self._onBrushEnd(this);
          });

      // Slider, brush zone, and handlers.
      this.slider = this.svg.append('g')
          .attr('class', 'slider')
          .attr('transform', 'translate(0,0)')
          .call(this.brush);

      this.handlers = {};

      this.handlers.left = this.slider.append('svg:image')
          .attr('class', 'handle')
          .attr('transform', 'translate(-8,{0})'.format(height/2 - 11))
          .attr('width', 16)
          .attr('height', 16)
          .attr('xlink:href', '/assets/svg/dragger2.svg')
          .attr('x', this.xscale(this._dateToDomain(this.currentDate[0])))
          .attr('y', -3);

      this.handlers.right = this.handlers.left
         .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
         .attr('x', this.xscale(this._dateToDomain(this.currentDate[1])));

      this.slider.select('.background')
          .style('cursor', 'pointer')
          .attr('height', height);

      // Selected domain.
      this.domain = this.svg.select('.xaxis')
        .append('svg:line')
        .attr('class', 'domain')
        .attr('transform', 'translate(0,{0})'.format(-3))
        .attr('x1', this.handlers.left.attr('x'))
        .attr('x2', this.handlers.right.attr('x'));

      // Tipsy
      this.tipsy = this.svg
        .insert('g', ':first-child')
        .attr('class', 'tipsy')
        .style('visibility', 'hidden');

      this.trail = this.tipsy.append('svg:line')
        .attr('class', 'trail')
        .attr('x1', this.handlers.right.attr('x'))
        .attr('x2', this.handlers.right.attr('x'))
        .attr('y1', 0)
        .attr('y2', height-2);

      this.tooltip = d3.select(this.$time[0]).append('div')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden')
        .style('left', '{0}px'.format(this.handlers.right.attr('x')))
        .text(this.options.dateRange[0].format('MMM'));

      // Handler position. We keep position x here so we know the
      // handler position without having to wait animations to finish.
      this.ext = {
        left: this.handlers.left.attr('x'),
        right: this.handlers.right.attr('x')
      };

      // Hidden brush for the animation
      if (this.options.player) {
        this.hiddenBrush = d3.svg.brush()
            .x(this.xscale)
            .extent([0, 0])
            .on('brush', function() {
              self._onAnimationBrush(this);
            })
            .on('brushend', function() {
              self._onAnimationBrushEnd(this);
            });
      }

      this.svg.selectAll('.extent,.resize')
          .remove();

      this._updateYearsStyle();
    },

    _onBrush: function(event) {
      var value = this.xscale.invert(d3.mouse(event)[0]);
      var rounded = Math.round(value);
      var x = this.xscale(rounded);
      var date = this._domainToDate(rounded);

      var xl = this.handlers.left.attr('x');
      var xr = this.handlers.right.attr('x');

      this._hideTipsy();
      this.playing && this.stopAnimation();

      if (Math.abs(this.xscale(value) - xr) <
        Math.abs(this.xscale(value) - xl)) {
        var dateOutsideLimit = date.isAfter(
          this.drMax[1].clone().add(1, 'month'));
        if (dateOutsideLimit || this.ext.left > x) { return; }

        this.domain.attr('x1', this.ext.left);
        // Set to max handler position when moving mouse fast to the right.
        if (date.isAfter(moment(this.drMax[1]))) {
          rounded = this._dateToDomain(this.drMax[1]);
        }
        this.ext.right = this.xscale(rounded);
        this._moveHandler(rounded, 'right');
      } else {
        var dateOutsideLimit = date.isBefore(
          this.drMax[0].clone().subtract(1, 'month'));
        if (dateOutsideLimit || this.ext.right < x) { return; }

        this.ext.left = x;
        this.domain.attr('x2', this.ext.right);
        this._moveHandler(rounded, 'left');
      }
    },

    _moveHandler: function(rounded, side) {
      var x = this.xscale(rounded);
      var date = this._domainToDate(rounded);

      this.handlers[side]
        .transition()
        .duration(this.options.effectsSpeed)
        .ease('line')
        .attr('x', x);

      var dx = (side === 'left') ? 'x1' : 'x2';

      this.domain
        .transition()
        .duration(this.options.effectsSpeed)
        .ease('line')
        .attr(dx, x);

      this._showTipsy();
      this.tooltip
        .text(moment(date).format('MMM') + ' - ' + moment(date).format('D'))
        .style('left', '{0}px'.format(x));

      this.trail
          .attr('x1', x)
          .attr('x2', x);

      this._updateYearsStyle();
    },

    _onBrushEnd: function() {
      var start = Math.round(this.xscale.invert(this.handlers.left.attr('x')));
      var end = Math.round(this.xscale.invert(_.toNumber(this.handlers.right.attr('x'))));

      start = this._domainToDate(start);
      end = this._domainToDate(end);
      this._updateCurrentDate([start, end]);

      setTimeout(_.bind(function() {
        !this.playing && this._hideTipsy();
      },this), 600);
    },

    _domainToDate: function(d) {
      var year = Math.floor(d/12) + moment(this.dr[0]).year();
      var month = (d >= 12) ? d - (Math.floor(d/12) * 12) : d;
      return moment([year, month]);
    },

    _dateToDomain: function(d) {
      return Math.floor(moment(d).utc().hour(12).diff(moment(this.dr[0]),
        'months', true));
    },

    /**
     * Handles a timeline date change UI event by dispaching
     * to TimelinePresenter.
     *
     * @param {Array} timelineDate 2D array of moment dates [begin, end]
     */
    _updateCurrentDate: function(date) {
      this.currentDate = date;
      this.presenter.updateTimelineDate(date);
    },

    getCurrentDate: function() {
      return this.currentDate;
    },

    _updateYearsStyle: function() {
      var self = this;
      d3.select('.xaxis-years').selectAll('text').filter(function(d) {
        d = self._dateToDomain(moment(d));
        if (d >= Math.round(self.xscale.invert(self.ext.left)) &&
          d <= Math.round(self.xscale.invert(self.ext.right))) {
          d3.select(this).classed('active', true);
        } else {
          d3.select(this).classed('active', false);
        }
      });
    },

    /**
     * Event fired when user clicks play/stop button.
     */
    _togglePlay: function() {
      (this.playing) ? this.stopAnimation() : this._animate();
    },

    _animate: function() {
      if (!this.options.player) {return;}
      this.presenter.startPlaying();
      var hlx = this.handlers.left.attr('x');
      var hrx = this.handlers.right.attr('x');
      var trailFrom = Math.round(this.xscale.invert(hlx)) + 1;
      var trailTo = Math.round(this.xscale.invert(hrx));

      if (trailTo === trailFrom) {
        return;
      }

      var speed = (trailTo - trailFrom) * this.options.playSpeed;

      this._togglePlayIcon();
      this.playing = true;
      this.domainsShown = []; // clean domain already loaded

      this._showTipsy();
      this.hiddenBrush.extent([trailFrom, trailFrom]);

      // Animate extent hiddenBrush to trailTo
      this.trail
          .call(this.hiddenBrush.event)
        .transition()
          .duration(speed)
          .ease('line')
          .call(this.hiddenBrush.extent([trailFrom, trailTo]))
          .call(this.hiddenBrush.event);
    },

    stopAnimation: function() {
      if (!this.options.player || !this.playing) {return;}
      // End animation extent hiddenBrush
      // this will call onAnimationBrushEnd
      this.trail
        .call(this.hiddenBrush.event)
        .interrupt();
    },

    _onAnimationBrush: function() {
      var value = this.hiddenBrush.extent()[1];
      var rounded = Math.round(value);
      var start = this._domainToDate(this.xscale.invert(this.handlers.left.attr('x')));
      var end = this._domainToDate(rounded);
      var x = this.xscale(rounded);

      this.domain
        .attr('x2', x);

      this.trail
        .attr('x1', x)
        .attr('x2', x);

      this.tooltip
        .text(end.format('MMM') + ' - ' + end.format('D'))
        .style('left', '{0}px'.format(x));

      // domainsShown keep track of the years already loaded.
      // reason to do this is that value is never an
      // absolute value so we don't know when the trail
      // is in the right position.
      if (this.domainsShown.indexOf(rounded) < 0 &&
        rounded > 0) {
        this._updateCurrentDate([start, end]);
        this.domainsShown.push(rounded);
      }
    },

    _onAnimationBrushEnd: function() {
      var value = this.hiddenBrush.extent()[1];
      var hrl = this.ext.left;
      // Trail from left handler + 1.
      var trailFrom = Math.round(this.xscale.invert(hrl)) + 1;

      if (value > 0 && value !==  trailFrom) {
        this.presenter.stopPlaying();
        this._togglePlayIcon();
        this.playing = false;
      }
    },

    _showTipsy: function() {
      this.tipsy.style('visibility', 'visible');
      this.tooltip.style('visibility', 'visible');
    },

    _hideTipsy: function() {
      this.tipsy.style('visibility', 'hidden');
      this.tooltip.style('visibility', 'hidden');
    },

    _togglePlayIcon: function() {
      this.$playIcon.toggle();
      this.$stopIcon.toggle();
    },

    getName: function() {
      return this.name;
    }
  });
  return TimelineYearClass;

});
