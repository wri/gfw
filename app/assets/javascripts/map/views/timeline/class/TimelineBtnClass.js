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

    initialize: function(layer) {
      this.layer = layer;
      this.name = layer.slug;

      this.options = _.extend({
        dateRange: [moment([2001]), moment()],
        playSpeed: 400,
        tickWidth: 120
      }, this.options);

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

      this.svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', this.options.tickWidth)
        .attr('height', 18)
        .attr('fill', 'pink')
        .attr('class', 'tick')
        .attr('x', _.bind(function(d, i) {
          i++;
          var slotWidth = (width / data.length);
          return (i * slotWidth) + ((slotWidth - this.options.tickWidth) / 2) - slotWidth;
        },this))
        .attr('y', 15);

      this.svg.selectAll('.tick')
        .on('click', _.bind(function(date) {
          console.log(date.start.format('MMM YYYY'), '--',
            date.end.format('MMM YYYY'));
          this.updateTimelineDate(date);
        }, this));
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
    }
  });

  return TimelineBtnClass;

});
