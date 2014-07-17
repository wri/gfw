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
      playSpeed: 400,
      width: 949,
      height: 50
    },

    events: {
      'click .play': 'togglePlay'
    },

    initialize: function(name) {
      _.bindAll(this, '_getData');
      this.name = name;
      this.options = _.extend({}, this.defaults, this.options || {});

      // Shortcouts
      this.dr = this.options.dateRange;

      // Number months to display
      this.monthsCount = Math.floor(this.dr[1].diff(this.dr[0],
        'months', true));

      this.render();
    },

    render: function() {
      this.$timeline = $('.timeline');
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
      var margin = {top: 30, right: 10, bottom: 0, left: 10};
      var width = this.options.width - margin.left - margin.right;
      var height = this.options.height - margin.bottom - margin.top;
      this.width = width;
      // xscale
      this.xscale = d3.scale.linear()
          .domain([0, this.monthsCount])
          .range([0, width])
          /**
           * Clamp: The return value of the scale is always
           * within the scale's output range.
           */
          .clamp(true);

      // SVG
      this.svg = d3.select(this.$time[0])
          .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate({0},{1})'.format(margin.left, margin.top));

      var data = this._getData();

      // xaxis
      this.xaxis = this.svg
          .append('g')
            .attr('class', 'xaxis')
            .selectAll('g')
            .data(data)
            .enter()
          .append('g')
            .attr('class', 'tick')
            .attr('transform', _.bind(function(d) {
              return 'translate(' + d.x + ', 0)';
            }, this));

      this.xaxis.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 5)
        .attr('height', 10)
        .text(function(d) {
          return d.label;
        });
    },

    _getData: function() {
      var data = [];

      for (var i = 0; i < this.monthsCount; i++) {
        var date = this._domainToDate(i);
        var yearsCount = Math.ceil(this.monthsCount/12) + 1;

        var slotWidth = (this.width - (yearsCount * 30)) / this.monthsCount;
        var xmonth = (i * slotWidth) + ((date.year() - (this.dr[0].year()-1)) * 30);

        if (date.month() === 0) {
          data.push({
            data: date,
            x: (i * slotWidth) + ((date.year() - this.dr[0].year()) * 30) + 2,
            label: date.year()
          });
        }

        if (date.month() === 11 && date.year()+1 === this.dr[1].year()) {
          data.push({
            data: date,
            x: (i * slotWidth) + ((date.year()+1 - this.dr[0].year()) * 30) + 6,
            label: date.year()+1
          });
        }

        data.push({
          date: date,
          x: xmonth,
          label: '▪'
        });
      }

      return data;
    },

    _domainToDate: function(d) {
      var year = Math.floor(d/12) + this.dr[0].year();
      var month = (d >= 12) ? d - (Math.floor(d/12) * 12) : d;
      return moment([year, month]);
    },

    getName: function() {
      return this.name;
    }
  });
  return TimelineYearClass;

});
