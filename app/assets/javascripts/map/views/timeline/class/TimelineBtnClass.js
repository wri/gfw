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
], function(_, Backbone, moment, d3, Handlebars) {

  'use strict';

  var TimelineBtnClass = Backbone.View.extend({

    className: 'timeline-btn',

    defaults: {
      dateRange: [moment([2001]), moment()],
      playSpeed: 400,
      width: 1000,
      height: 50,
      tickWidth: 120
    },

    initialize: function(layer) {
      _.bindAll(this, '_onClickTick', '_selectDate');

      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});
      this.currentDate = null;

      // d3 slider objets
      this.svg = {};
      this.xscale = {};

      this.render();
    },

    /**
     * Render d3 timeline slider.
     */
    render: function() {
      var self = this;
      this.$timeline = $('.timeline');
      this.$timeline.append(this.el);

      // SVG options
      var margin = {top: 0, right: 15, bottom: 0, left: 15};
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.bottom - margin.top;

      // Set xscale
      this.xscale = d3.scale.linear()
          .domain([this.options.dateRange[0].month(), this.options.dateRange[1].month()])
          .range([0, width])
          .clamp(true);

      var data = this._getData();

      // Set SVG
      this.svg = d3.select(this.el)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Set tipsy
      this.tipsy = this.svg.append('g')
        .attr('class', 'tipsy') 
        .style('visibility', 'visible');

      this.trail = this.tipsy.append('svg:line')
        .attr('class', 'trail')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height);

      this.tooltip = d3.select(this.el).append('div')
        .attr('class', 'tooltip');

      // Set ticks
      this.tickG = this.svg.append('g')
        .attr('class', 'ticks')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', _.bind(function(d, i) {
          i++;
          var slotWidth = (width / data.length);
          var x =  (i * slotWidth) +
            ((slotWidth - this.options.tickWidth) / 2) - slotWidth;

          return 'translate(' + x + ', 15)';
        }, this));

      this.tickG.append('rect')
        .attr('width', this.options.tickWidth)
        .attr('height', 17)
        .attr('ry', 2);

      this.tickG.append('text')
        .attr('y', 13)
        .attr('x', 10)
        .text(this._getTickText);

      this.tickG
        .on('click', function(date, i) {
          self._onClickTick(this, date, i);
        });
    },

    _onClickTick: function(el, date) {
      this._selectDate(el, date);
      this._updateTimelineDate(date);
    },


    /**
     * Add selected class to the tick and moves
     * the tipsy to that position.
     * 
     * @param  {object} el   Tipsy element
     * @param  {date}   date {start:{}, end:{}}
     */
    _selectDate: function(el, date) {
      el = d3.select(el);
      var x = d3.transform(el.attr("transform")).translate[0];
      var trailX = x + (this.options.tickWidth / 2);

      this.svg.selectAll('.tick').filter(function(d) {
        d3.select(this).classed('selected', false);});

      el.classed('selected', true);

      this.trail
        .transition()
        .duration(100)
        .ease('line')
        .attr('x1', trailX)
        .attr('x2', trailX);

      this.tooltip
        .transition()
        .duration(100)
        .ease('line')
        .text(this._getTooltipText(date))
        .style('left', x + 'px');
    },

    _getTooltipText: function(date) {
      return '{0}-{1} {2}'.format(date.start.format('MMM'),
          date.end.format('MMM'), date.end.year());
    },

    /**
     * Handles a timeline date change UI event by dispaching
     * to TimelinePresenter.
     *
     * @param {Array} timelineDate 2D array of moment dates [begin, end]
     */
    _updateTimelineDate: function(date) {
      var formatted = [date.start, date.end];
      this.currentDate = formatted;
      this.presenter.updateTimelineDate(formatted);
    },

    _getTickText: function() {
    },

    getName: function() {
      return this.name;
    },

    getCurrentDate: function() {
      return this.currentDate;
    }
  });

  return TimelineBtnClass;

});
