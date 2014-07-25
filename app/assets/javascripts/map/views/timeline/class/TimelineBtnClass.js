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
], function(_, Backbone, moment, d3) {

  'use strict';

  var TimelineBtnClass = Backbone.View.extend({

    className: 'timeline-btn',

    defaults: {
      dateRange: [moment([2001]), moment()],
      width: 1000,
      height: 50,
      tickWidth: 120,
      tipsy: true
    },

    initialize: function(layer) {
      _.bindAll(this, '_onClickTick', '_selectDate');
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});
      this.data = this._getData();

      this.layer.currentDate = this.layer.currentDate ||
        [this.data[this.data.length - 1].start, this.data[this.data.length - 1].end];

      // d3 slider objets
      this.svg = {};
      this.xscale = {};

      this.render(_.bind(function() {
        this._selectDate({
          start: this.layer.currentDate[0],
          end: this.layer.currentDate[1]
        });
      }, this));

    },

    /**
     * Render d3 timeline slider.
     */
    render: function(callback) {
      var self = this;
      this.$timeline = $('.timeline-container');
      this.$timeline.parents('.widget-box').css('width', this.options.width);
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
      if (this.options.tipsy) {
        this.tipsy = this.svg.append('g')
          .attr('class', 'tipsy')
          .style('visibility', 'hidden');

        this.trail = this.tipsy.append('svg:line')
          .attr('class', 'trail')
          .attr('x1', width)
          .attr('x2', width)
          .attr('y1', 0)
          .attr('y2', height);

        this.tooltip = d3.select(this.el).append('div')
          .attr('class', 'tooltip')
          .style('left', width + 'px')
          .style('visibility', 'hidden');
      }

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
        .text(function(d) {
          return d.label;
        });

      this.tickG
        .on('click', function(date, i) {
          self._onClickTick(this, date, i);
        });

      callback();
    },

    _onClickTick: function(el, date) {
      this._selectDate(date, el);
      this._updateTimelineDate([date.start, date.end]);
    },

    /**
     * Add selected class to the tick and moves
     * the tipsy to that position.
     *
     * @param  {object} el   Tipsy element
     * @param  {date}   date {start:{}, end:{}}
     */
    _selectDate: function(date, el) {
      if (!el) {
        el = this.tickG.filter(function(d) {
          var dformat = 'DD-MM-YYYY';
          return (d.start.format(dformat) === date.start.format(dformat) &&
            d.end.format(dformat) === date.end.format(dformat));
        }).node();
      }

      el = d3.select(el);

      var x = d3.transform(el.attr('transform')).translate[0];
      var trailX = x + (this.options.tickWidth / 2);

      this.svg.selectAll('.tick').filter(function() {
        d3.select(this).classed('selected', false);
      });

      el.classed('selected', true);

      // Move tipsy
      if (this.options.tipsy) {
        var duration = (this.tipsy.style('visibility') === 'visible') ? 100 : 0;

        this.tipsy
          .style('visibility', 'visible');

        this.trail
          .transition()
          .duration(duration)
          .ease('line')
          .attr('x1', trailX)
          .attr('x2', trailX);

        this.tooltip
          .transition()
          .duration(duration)
          .ease('line')
          .text(this._getTooltipText(date))
          .style('left', x + 'px')
          .style('visibility', 'visible');
      }
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
      this.layer.currentDate = date;
      this.presenter.updateTimelineDate(date);
    },

    getName: function() {
      return this.name;
    },

    getCurrentDate: function() {
      return this.layer.currentDate;
    }
  });

  return TimelineBtnClass;

});
