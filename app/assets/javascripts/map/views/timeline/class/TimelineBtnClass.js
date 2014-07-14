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
      tickWidth: 120
    },

    initialize: function(layer) {
      _.bindAll(this, '_onClickTick', '_selectFirstTick');

      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});

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
      var width = 1000 - margin.left - margin.right;
      var height = 50 - margin.bottom - margin.top;

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

      this.tickG = this.svg.selectAll('g')
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

      // TODO => URL dateRange params
      this._selectFirstTick();
    },

    _onClickTick: function(el, date, i) {
      this.svg.selectAll('.tick').filter(function(d) {
        d3.select(this).classed('selected', false)
      });

      d3.select(el).classed('selected', true)
      this.updateTimelineDate(date);
    },

    _selectFirstTick: function() {
      d3.select(this.tickG.node()).classed('selected', true);
    },

    /**
     * Handles a timeline date change UI event by dispaching
     * to TimelinePresenter.
     *
     * @param {Array} timelineDate 2D array of moment dates [begin, end]
     */
    updateTimelineDate: function(date) {
      this.presenter.updateTimelineDate([date.start, date.end]);
    },

    getName: function() {
      return this.name;
    },

    _getTickText: function() {
    }
  });

  return TimelineBtnClass;

});
