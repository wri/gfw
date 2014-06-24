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
  'd3',
  'text!map/templates/timeline.html'
], function(Backbone, presenter, moment, d3, timelineTpl) {

  var Timeline = Backbone.View.extend({

    className: 'timeline timeline-date-range',
    template: _.template(timelineTpl),

    events: {
      'click .play': 'onClickPlay'
    },

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
      this.$el.html(this.template());
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');
      $('.map-container').append(this.el);
      this.loadSlider();
    },

    stopAnimation: function() {
      this.$playIcon.show();
      this.$stopIcon.hide();
    },

    animate: function() {
      this.$playIcon.hide();
      this.$stopIcon.show();

      this.tipsy.style("visibility", 'visible');
    },

    onClickPlay: function() {
      if (this.playing) {
        this.stopAnimation();
      } else {
        this.animate();
      }
    },

    loadSlider: function() {
      var self = this;
      var margin = {top: 0, right: 30, bottom: 0, left: 30};
      var width = 949 - margin.left - margin.right;
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
      this.svg = d3.select(this.$time[0]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Bar, years
      this.svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(0, " + (height / 2) + ")")
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
          .style("cursor", "pointer")
          .attr("height", height);

      // Tipsy
      this.tipsy = this.svg.append("g")
        .attr("class", "tipsy")
        .style("visibility", "visible");

      this.trail = this.tipsy.append("svg:line")
        .attr("class", "trail")
        .attr("x1", this.handlers.left.attr("x"))
        .attr("x2", this.handlers.left.attr("x"))
        .attr("y1", 0)
        .attr("y2", height)
        .style("fill", 'red');

      this.tooltip = this.tipsy.append("g")
        .attr("class", "tooltip");

      this.tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 25)
        .attr("x", -18)
        .attr("y", -20)
        .attr("rx", 2)
        .attr("ry", 2);

      this.tooltip.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("dy", "1.6em")
        .style("fill", 'white')
        .text(this.opts.dateRange[0].year());

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
      setTimeout(function() {
        this.updateTimelineDate([moment([startYear]), moment([endYear])]);
      }.bind(this), 20);
    },

    updateTimelineDate: function(timelineDate) {
      presenter.set('timelineDate', timelineDate);
    }
  });

  return Timeline;

});