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
  'handlebars',
  'text!templates/timelineYear.handlebars'
], function(_, Backbone, moment, d3, Handlebars, tpl) {

  'use strict';

  var TimelineYearClass = Backbone.View.extend({

    className: 'timeline-month',

    template: Handlebars.compile(tpl),

    defaults: {
      dateRange: [moment([2001]), moment()],
      width: 949,
      height: 50,
      playSpeed: 400,
      effectsSpeed: 100
    },

    events: {
      'click .play': 'togglePlay'
    },

    initialize: function(layer) {
      console.log(layer);
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});
      console.log(_.clone(this.layer.currentDate));
      this.layer.currentDate = this.layer.currentDate || this.options.dateRange;
      // Transitions duration are 100 ms. Give time to them to finish.
      this._updateCurrentDate = _.debounce(this._updateCurrentDate,
        this.options.effectsSpeed);

      // Shortcouts
      this.dr = this.options.dateRange;

      // Number months to display
      this.monthsCount = Math.floor(this.dr[1].diff(this.dr[0],
        'months', true));

      console.log('months', this.monthsCount);

      this.render();
    },

    render: function() {
      _.bindAll(this, '_moveHandler');
      var self = this;
      this.$timeline = $('.timeline-container');
      this.$el.html(this.template());
      this.$timeline
          .css('width', 1000)
          .append(this.el);

      // Cache
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');

      // SVG options
      var margin = {top: 30, right: 20, bottom: 0, left: 20};
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
          .append('g')
            .attr('transform', 'translate({0},{1})'.format(margin.left, margin.top));

      // xAxis
      this.svg.append('g')
          .attr('class', 'xaxis-months')
          .attr('transform', 'translate(0,0)')
          .call(d3.svg.axis()
            .scale(this.xscale)
            .orient('top')
            .ticks(this.monthsCount)
            .tickFormat(function(d) {return '▪'; })
            .tickSize(0)
            .tickPadding(0))
          .select('.domain').remove();

      this.svg.select('.xaxis-months').selectAll('g.line').remove();

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

      this.handlers.left = this.slider.append('rect')
          .attr('class', 'handle')
          .attr('transform', 'translate(-7,0)')
          .attr('width', 14)
          .attr('height', 14)
          .attr('x', this.xscale(this._dateToDomain(this.layer.currentDate[0])))
          .attr('y', -1)
          .attr('rx', 2)
          .attr('ry', 2);

      this.handlers.right = this.handlers.left
         .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
         .attr('x', this.xscale(this._dateToDomain(this.layer.currentDate[1])));

      this.slider.select('.background')
          .style('cursor', 'pointer')
          .attr('height', height);
    },

    _onBrush: function(event) {
      var value = this.xscale.invert(d3.mouse(event)[0]);
      var rounded = Math.round(value);
      var date = this._domainToDate(rounded);

      var xl = this.handlers.left.attr('x');
      var xr = this.handlers.right.attr('x');

      if (Math.abs(this.xscale(value) - xr) <
        Math.abs(this.xscale(value) - xl)) {
        this._moveHandler(rounded, 'right');
      } else {
        this._moveHandler(rounded, 'left');
      }
    },

    _moveHandler: function(x, side) {
      this.handlers[side]
        .transition()
        .duration(this.options.effectsSpeed)
        .ease('line')
        .attr('x', this.xscale(x));
    },

    _onBrushEnd: function(event) {
      var start = Math.floor(this.xscale.invert(this.handlers.left.attr('x')));
      var end = Math.ceil(this.xscale.invert(this.handlers.right.attr('x')));

      start = this._domainToDate(start);
      end = this._domainToDate(end);
      this._updateCurrentDate([start, end]);
    },

    _domainToDate: function(d) {
      var year = Math.floor(d/12) + this.dr[0].year();
      var month = (d >= 12) ? d - (Math.floor(d/12) * 12) : d;
      return moment([year, month]);
    },

    _dateToDomain: function(d) {
      return Math.floor(d.diff(this.dr[0],
        'months', true));
    },

    /**
     * Handles a timeline date change UI event by dispaching
     * to TimelinePresenter.
     *
     * @param {Array} timelineDate 2D array of moment dates [begin, end]
     */
    _updateCurrentDate: function(date) {
      this.layer.currentDate = date;
      this.presenter.updateTimelineDate(date);
      console.log('setting', date[0].format('YYYY-MMM'), date[1].format('YYYY-MMM'));
    },

    getName: function() {
      return this.name;
    }
  });
  return TimelineYearClass;

});
