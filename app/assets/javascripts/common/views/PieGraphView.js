define([
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'text!common/templates/pieGraph.handlebars'
], function(
  Backbone,
  _,
  Handlebars,
  d3,
  tpl
) {

  'use strict';

  var PieGraphView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    defaults: {
      chartEl: 'pie-graph-svg',
      animationTime: 400,
      outerRadius: 40,
      removeTimeout: 300,
      margin: {
        top: 0,
        right: 40,
        bottom: 0,
        left: 40
      }
    },

    initialize: function(settings) {
      this.defaults = _.extend({}, this.defaults, settings);
      this.data = this.defaults.data;

      this._initChart();

      // Sets listeners
      this.setListeners();
    },

    _initChart: function() {
      // Data parsing and initialization
      this._parseData();
      this.hasData = this.chartData && this.chartData.length;

      if (this.hasData) {
        this._start();
      } else {
        this._renderNoData();
      }

    },

    _start: function() {
      this.$el.html(this.template({
        hasData: this.chartData.length
      }));

      this.render();
    },

    _renderNoData: function() {
      this.$el.html(this.template({
        hasData: this.hasData,
      }));
    },

    render: function() {
      this._setUpGraph();
      // this._setAxisScale();
      // this._setDomain();
      // this._drawAxis();
      // this._drawGraph();
     },

    /**
     * Sets the listeners for the component
     */
    setListeners: function() {
      this.refreshEvent = _.debounce(_.bind(this._update, this), 30);
      window.addEventListener('resize', this.refreshEvent, false);
    },

    unsetListeners: function() {
      window.removeEventListener('resize', this.refreshEvent, false);

      this.refreshEvent = null;
    },

    /**
     *  Parses the data for the chart
     */
    _parseData: function() {
      this.chartData = this.data;
    },

    /**
     *  Sets up the SVG for the graph
     */
    _setUpGraph: function() {
      this.chartEl = this.el.querySelector('.' + this.defaults.chartEl);
      var el = this.chartEl;
      var margin = this.defaults.margin;
      this.cWidth = el.clientWidth;
      this.cHeight = el.clientHeight;

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;
      this.radius = Math.min(this.cWidth - this.defaults.outerRadius, this.cHeight - this.defaults.outerRadius) / 2;

      this.svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right)
        .attr('height', this.cHeight + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    /**
     *  Sets the axis
     */
    _setAxisScale: function() {
      var _this = this;
      var xTickFormat = d3.time.format(_this.defaults.dateFormat);
      var yTickFormat = function(d) {
        return d > 999 ? (d / 1000) + 'k' : d;
      };
      var yNumTicks = 4;

      this.x = d3.time.scale()
        .range([0, this.cWidth]).nice();

      this.y = d3.scale.linear()
        .range([this.cHeight, 0]).nice();

      this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom')
        .innerTickSize(-this.cHeight)
        .tickValues(this._getTicksValues())
        .outerTickSize(0)
        .tickPadding(5)
        .tickFormat(xTickFormat);
    },

    /**
     *  Get the custom ticks
     */
    _getTicksValues: function() {
      var values = [];

      values.push(this.dates[0]);
      values.push(this.dates[Math.round(((this.dates.length - 1) / 2))]);
      values.push(this.dates[this.dates.length - 1]);

      return values;
    },

    /**
     * Sets the domain
     */
    _setDomain: function() {
      this.x.domain(this.domain.x);
      this.y.domain(this.domain.y);
    },

    /**
     * Draws the axis
     */
    _drawAxis: function() {
      if (this.defaults.xAxisLabels) {
        // X Axis
        var xAxis = this.svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + (this.cHeight) + ')')
          .call(this.xAxis);

          xAxis.selectAll('text')
            .attr('x', this.defaults.paddingXAxisLabels)
            .style('text-anchor', 'middle')
            .attr('y', this.defaults.paddingYAxisLabels);

          xAxis.selectAll('line')
            .attr('x1', this.defaults.paddingXAxisLabels)
            .attr('x2', this.defaults.paddingXAxisLabels);
      }

      // Custom domain
      this.svg.append('g')
        .attr('class', 'custom-domain-group')
        .attr('transform', 'translate('+ this.defaults.paddingXAxisLabels +', ' + this.cHeight +')')
        .append('line')
          .attr('class', 'curstom-domain')
          .attr('x1', -this.defaults.paddingAxisLabels)
          .attr('x2', (this.cWidth  + this.defaults.paddingAxisLabels))
          .attr('y1', 0)
          .attr('y2', 0);
    },

    /**
     * Draws the entire graph
     */
    _drawGraph: function() {
      this._addDefs();
      this._drawSolidLine();
      this._drawDots();
    },

    /**
     * Add defs for styling
     */
    _addDefs: function() {
      var gradient = this.svg.append('defs')
        .append('linearGradient')
          .attr('id', 'gradient')
          .attr('x1', '57%')
          .attr('y1', '50%')
          .attr('x2', '100%')
          .attr('y2', '50%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#DBDBDE')
        .attr('stop-opacity', 1);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#FF6699')
        .attr('stop-opacity', 1);
    },

    /**
     * Draws the solid line
     */
    _drawSolidLine: function() {
      var _this = this;
      var solidLineGroup = this.svg.append('g')
        .attr('class', 'line-group')
        .attr('transform', 'translate('+ _this.defaults.paddingXAxisLabels +' ,'+ -this.defaults.paddingAxisLabels + ')');

      this.linePath = d3.svg.line()
        .x(function(d) { return _this.x(d.date); })
        .y(function(d) { return _this.y(d.value); })
        .interpolate(this.defaults.interpolate);

      this.graphLine = solidLineGroup.append('path')
        .attr('d', this.linePath(this.chartData))
        .attr('stroke', 'url(#gradient)')
        .attr('fill', 'none')
        .attr('stroke-width', 2);
    },

    /**
     * Draws the dots
     */
    _drawDots: function() {
      var _this = this;
      var dotsGroup = this.svg.append('g')
        .attr('class', 'dots-group')
        .attr('transform', 'translate('+ _this.defaults.paddingXAxisLabels +', '+ -this.defaults.paddingAxisLabels + ')');
      var dot = this.chartData[this.chartData.length - 1];

      dotsGroup.append('circle')
          .attr('class', 'dot')
          .attr('r', _this.defaults.circleRadius)
          .attr('cx', function(d) {
            return _this.x(dot.date)
          })
          .attr('cy', function(d) {
            return _this.y(dot.value)
          });
    },

    /**
     *  Renders the chart after a resize
     */
    _update: function() {
      this.remove({
        keepEvents: true
      });
      this.render();
    },

    /**
     * Removes the SVG
     */
    remove: function(params) {
      if(this.svg) {
        var svgContainer = this.chartEl.querySelector('svg');

        if (params && !params.keepEvents) {
          this.unsetListeners();
          this.stopListening();
        }
        this.svg.remove();
        this.svg = null;
        this.chartEl.removeChild(svgContainer);
      }
    }

  });

  return PieGraphView;

});
