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

    initialize: function(layer, currentDate) {
      _.bindAll(this, '_onClickTick', '_selectDate');
      this.layer = layer;
      this.name = layer.slug;

      ga('send', 'event', 'Map', 'Settings', 'Timeline: ' + layer.slug);
      this.options = _.extend({}, this.defaults, this.options || {});
      this.data = this._getData();

      if (currentDate && currentDate[0]) {
        this.currentDate = currentDate;
      } else {
        this._updateCurrentDate([this.data[this.data.length - 1].start,
          this.data[this.data.length - 1].end]);
      }

      // d3 slider objets
      this.svg = {};
      this.xscale = {};

      this.render(_.bind(function() {
        this._selectDate({
          start: this.currentDate[0],
          end: this.currentDate[1]
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

        this.tooltip = d3.select(this.el).append('div')
          .attr('class', 'tooltip')
          .style('left', width + 'px')
          .style('visibility', 'hidden');
      }

      // Set ticks
      this.tickG = this.svg.append('g')
        .attr('class', 'ticks')
        .selectAll('g')
        .data(this.data)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .attr('transform', _.bind(function(d, i) {
          i++;
          var slotWidth = (width / this.data.length);
          var x =  (i * slotWidth) +
            ((slotWidth - this.options.tickWidth) / 2) - slotWidth;

          return 'translate(' + x + ', 13)';
        }, this));

      this.tickG.append('rect')
        .attr('width', this.options.tickWidth)
        .attr('height', 24)
        .attr('ry', 12);


      this.tickG.append('text')
        .attr('y', 16)
        .attr('x', this.options.tickWidth/2)
        .attr('text-anchor', 'middle')
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
      this._updateCurrentDate([date.start, date.end]);
      ga('send', 'event', 'Map', 'Settings', 'Timeline: '+ el);
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

      this.svg.selectAll('.tick').filter(function() {
        d3.select(this).classed('selected', false);
      });

      el.classed('selected', true);

      // Move tipsy
      if (this.options.tipsy) {
        var duration = (this.tipsy.style('visibility') === 'visible') ? 100 : 0;

        this.tipsy
          .style('visibility', 'visible');

        this.tooltip
          .transition()
          .duration(duration)
          .ease('line')
          .text(this._getTooltipText(date))
          .style('left', x + 'px')
          .style('visibility', 'visible');
      }
      ga('send', 'event', 'Map', 'Settings', 'Timeline: ' + el);
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
    _updateCurrentDate: function(date) {
      this.currentDate = date;
      this.presenter.updateTimelineDate(date);
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
