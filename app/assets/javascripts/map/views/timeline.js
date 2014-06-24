/**
 * The timeline module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 * 
 * @return Timeline class (extends Backbone.View).
 */
define([
  'backbone',
  'presenter',
  'moment',
  'd3'
], function(Backbone, presenter, moment, d3) {

  var Timeline = Backbone.View.extend({

    className: 'timeline timeline-date-range',

    initialize: function(opts) {
      _.bindAll(this, 'onAnimate', 'onBrush', 'onBrushEnd');

      this.opts = _.extend({
        dateRange: [moment([2001]), moment()],
        layerName: '',
        xAxis: {
          months: {
            enabled: false,
            steps: false
          }
        }
      }, opts);

      // Status
      this.playing = false;

      // d3 slider objets
      this.svg = {};
      this.xscale = {};
      this.brush = {};
      this.slider = {};
      this.handlers = {
        left:{},
        right:{}
      };

      this.render();
    },

    render: function() {
      this.loadSlider();
      $('.map-container').append(this.$el);
    },

    loadSlider: function() {
      var self = this;

      var margin = {top: 0, right: 25, bottom: 0, left: 25};
      
      var width = 1000 - margin.left - margin.right;
      var height = 50 - margin.bottom - margin.top;

      // Set xscale
      this.xscale = d3.scale.linear()
          .domain([this.opts.dateRange[0].year(), this.opts.dateRange[1].year()])
          .range([0, width])
          .clamp(true);

      // Set brush and listeners
      this.brush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on("brush", function() {
            self.onBrush(this)
          })
          .on("brushend", function() {
            self.onBrushEnd(this);
          });

      // Set top svg
      this.svg = d3.select(this.el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Bar, years
      this.svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(0," + (height / 2) + ")")
          .call(d3.svg.axis()
            .scale(this.xscale)
            .orient("top")
            .ticks(this.opts.dateRange[1].year() - this.opts.dateRange[0].year())
            .tickFormat(function(d) { return String(d); })
            .tickSize(0)
            .tickPadding(-4))
        .select(".domain").remove();

      // Handlers
      this.slider = this.svg.append("g")
          .attr("class", "slider")
          .call(this.brush);

      this.handlers.left = this.slider.append("rect")
          .attr("class", "handle")
          .attr("transform", "translate(0," + (height / 2 - 6) + ")")
          .attr("width", 13)
          .attr("height", 13)
          .attr("x", 16)
          .attr("y", 0)
          .attr("rx", 2)
          .attr("ry", 2);

      this.handlers.right = this.handlers.left
         .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
         .attr('x', this.xscale(this.opts.dateRange[1].year()) - 30);

      this.slider.selectAll(".extent,.resize")
          .remove();

      this.slider.select(".background")
          .style('cursor', 'pointer')
          .attr("height", height);
    },

    onBrush: function(event) {
      var value = this.xscale.invert(d3.mouse(event)[0]);
      var roundValue = Math.round(value);
      var timelineDate = presenter.get('timelineDate') || this.opts.dateRange;
      
      var xl = this.handlers.left.attr("x");
      var xr = this.handlers.right.attr("x");

      // is this needed?
      this.brush.extent([roundValue, roundValue]);

      if (Math.abs(this.xscale(value) - xr - 30) <
        Math.abs(this.xscale(value) - xl + 16)) {
      // Move right handler
        this.handlers.right
          .transition()
          .duration(100)
          .ease('line')
          .attr("x", this.xscale(roundValue) - 30);
      } else {
      // Move left handler
        this.handlers.left
          .transition()
          .duration(100)
          .ease('line')
          .attr("x", this.xscale(roundValue) + 16);
      }
    },

    onBrushEnd: function(event) {
      var startYear = Math.round(this.xscale.invert(this.handlers.left.attr("x")));
      var endYear = Math.round(this.xscale.invert(this.handlers.right.attr("x")));

      this.updateTimelineDate([moment([startYear]), moment([endYear])]);
    },

    updateTimelineDate: function(timelineDate) {
      presenter.set('timelineDate', timelineDate);
    }
  });

  return Timeline;

});