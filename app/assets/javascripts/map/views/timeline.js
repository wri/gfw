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
      return this.$el;
    },

    loadSlider: function() {
      var self = this;

      var margin = {top: 0, right: 25, bottom: 0, left: 25},
          width = 900 - margin.left - margin.right,
          height = 40 - margin.bottom - margin.top;

      this.xscale = d3.scale.linear()
          .domain([this.opts.dateRange[0].year(), this.opts.dateRange[1].year()])
          .range([0, width])
          .clamp(true);

      this.brush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on("brush", function() {
            self.onBrush(this)
          })
          .on("brushend", function() {
            self.onBrush(this, true);
          });

      this.svg = d3.select(this.el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       // Bar, years
      this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height / 2 + ")")
          .call(d3.svg.axis()
            .scale(this.xscale)
            .orient("bottom")
            .ticks(this.opts.dateRange[1].year() - this.opts.dateRange[0].year())
            .tickFormat(function(d) { return String(d); })
            .tickSize(0)
            .tickPadding(12))
        .select(".domain")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "halo")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "selected-domain");

      // Slider
      this.slider = this.svg.append("g")
          .attr("class", "slider")
          .call(this.brush);

      this.handlers.left = this.slider.append("circle")
          .attr("class", "handle")
          .attr("transform", "translate(0," + height / 2 + ")")
          .attr("r", 7)
          .attr("cx", 0)
          .style('fill', 'red');

      this.handlers.right = this.handlers.left
         .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
         .attr('cx', this.xscale(this.opts.dateRange[1].year()))
         .style('fill', 'green');

      this.slider.selectAll(".extent,.resize")
          .remove();

      this.slider.select(".background")
          .style('cursor', 'pointer')
          .attr("height", height);

      // load tipsy
      this.tipsy = this.svg.append('g')
          .attr('class', 'tipsy')
          .attr("transform", "translate(0, 0)")
        .style('visibility', 'hidden');
      
      this.trail = this.tipsy.append('svg:line')
          .attr('class', 'trail')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', height)
          .style('stroke', 'black');

      this.hiddenBrush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on("brush", this.onAnimate);
    },

    onAnimate: function() {
      var value = this.hiddenBrush.extent()[0];

      if (!this.playing) return;

      var leftHandlerYear = Math.round(this.xscale.invert(this.handlers.left.attr('cx')));

      if (!(this.yearsArr.indexOf(Math.round(value)) > -1) && Math.round(value) > 0) {
        this.trail
          .attr('x1', this.xscale(Math.round(value)))
          .attr('x2', this.xscale(Math.round(value)));

        this.updateTimelineDate([leftHandlerYear, Math.round(value)]);

        this.yearsArr.push(Math.round(value));
      }
    },

    animate: function() {
      this.yearsArr = [];
      this.stopAnimation();
      this.playing = true;

      this.tipsy
        .style('visibility', 'visible');

      var rightHandlerYear = Math.round(this.xscale.invert(this.handlers.right.attr('cx')));

      this.trail
        .call(this.hiddenBrush.event)
      .transition()
        .duration(5000)
        .ease('line')
        .call(this.hiddenBrush.extent([rightHandlerYear, rightHandlerYear]))
        .call(this.hiddenBrush.event);
    },

    stopAnimation: function() {
      this.playing = false;

      this.tipsy
        .style('visibility', 'hidden');

      var leftHandlerYear = Math.round(this.xscale.invert(this.handlers.left.attr('cx')));

      this.trail
        .call(this.hiddenBrush.event)
        .interrupt()
        .call(this.hiddenBrush.extent([leftHandlerYear, leftHandlerYear]))
        .attr('x1', this.handlers.left.attr('cx'))
        .attr('x2', this.handlers.left.attr('cx'));
    },

    onBrush: function(event, brushend) {
      var value = this.brush.extent()[0];
      var timelineDate = presenter.get('timelineDate') || this.opts.dateRange;

      if (this.playing && brushend) this.stopAnimation();
      if (this.playing) return;
      this.stopAnimation();

      if (d3.event.sourceEvent) { // not a programmatic event
        value = this.xscale.invert(d3.mouse(event)[0]); // this should be event
        this.brush.extent([Math.round(value), Math.round(value)]);
      }

      var hl = this.handlers.left.attr("cx"),
          hr = this.handlers.right.attr("cx");

      if (Math.abs(this.xscale(value) - hr) < Math.abs(this.xscale(value) - hl)) {
        this.handlers.right
          .transition()
          .duration(50)
          .ease('line')
          .attr("cx", this.xscale(Math.round(value)));      
        this.updateSelectedDomain(Math.round(value), 'right');
        if (brushend) this.updateTimelineDate([timelineDate[0], moment([Math.round(value)])]);
      } else {
        this.handlers.left
          .transition()
          .duration(50)
          .ease('line')
          .attr("cx", this.xscale(Math.round(value)));

        this.updateSelectedDomain(Math.round(value), 'left');
        if (brushend) {
          this.updateTimelineDate([moment([Math.round(value)]), timelineDate[1]]);
        }
      }
    },

    updateSelectedDomain: function(value, position) {
      var pathinfo = null;
      if (position == 'right') {
        pathinfo = [
          {x: this.handlers.left.attr("cx"), y: 0},
          {x: this.xscale(value), y: 0}
        ];
      } else {
        pathinfo = [
          {x: this.xscale(value), y: 0},
          {x: this.handlers.right.attr("cx"), y: 0}
        ];
      }

      var d3line2 = d3.svg.line()
        .x(function(d){return d.x;})
        .y(function(d){return d.y;})
        .interpolate("linear");

      this.svg.select('.selected-domain')
        .attr("d", d3line2(pathinfo));
          
    },

    updateTimelineDate: function(timelineDate) {
      presenter.set('timelineDate', timelineDate);
    }
  });

  return Timeline;

});