define([
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'core/View',
  'mps',
  'moment',
  'text!common/templates/lineGraph.handlebars'
], function(
  Backbone,
  _,
  Handlebars,
  d3,
  View,
  mps,
  moment,
  tpl
) {

  'use strict';

  var LineGraphView = View.extend({

    template: Handlebars.compile(tpl),

    defaults: {
      chartEl: 'line-graph-svg',
      chartClass: 'js-line-graph',
      xAxisLabels: true,
      interpolate: 'linear',
      dateFormat: '%Y',
      paddingAxisLabels: 10,
      paddingXAxisLabels: 20,
      paddingYAxisLabels: 10,
      circleRadius: 4.5,
      xValues: null,
      xValuesInteger: null,
      yValues: null,
      parentValue: null,
      restart: false,
      margin: {
        top: 20,
        right: 35,
        bottom: 35,
        left: 0
      }
    },

    initialize: function(settings) {
      _.bindAll(this, 'moveCircle');
      this.defaults.restart = settings.restart;

      if (this.defaults.restart) {
        mps.publish('Line/clean', [this.defaults.restart]);
      }

      this.defaults = _.extend({}, this.defaults, settings);
      this.data = this.defaults.data;
      if (this.defaults.treeCoverLossAlerts) {
        this.dataTotal = this.defaults.totalData;
      }
      if (this.data.length > 12 && this.defaults.treeCoverLossAlerts) {
        var pastMonths = this.data.length - 12;
        for (var i = 0; i < pastMonths; i++) {
          this.data.shift();
        }
      }
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
      this._setAxisScale();
      this._setDomain();
      this._drawAxis();
      this._drawGraph();
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
      var tzOffset = new Date().getTimezoneOffset();
      var dates = [];
      this.chartData = [];

      for (var indicator in this.data) {
        var current = this.data[indicator];
        current.date = current.date.add(tzOffset, 'minutes').toDate();
        dates.push(current.date);
        this.chartData.push(current);
      }

      this.dates = dates;
    },

    /**
     *  Sets up the SVG for the graph
     */
    _setUpGraph: function() {
      this.chartEl = this.el.querySelector('.' + this.defaults.chartEl);
      var el = this.chartEl
      var margin = this.defaults.margin;

      el.innerHTML = '';
      el.classList.add(this.defaults.chartClass);

      this.cWidth = el.clientWidth;
      this.cHeight = el.clientHeight;
      this.domain = this._getDomain();

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;

      var svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right + 'px')
        .attr('height', this.cHeight + margin.top + margin.bottom + 'px')
        .attr('class', 'svg-'+this.cid)
        .on('mousemove', this.moveCircle)
        .on('mouseout', this.restartCircle);

      this.svg = svg.append('g')
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
     *  Get the domain values
     */
    _getDomain: function() {
      var xValues = [];
      var yValues = [];

      this.chartData.forEach(function(data) {
        xValues.push(data.date);
        yValues.push(data.value);
      });


      return {
        x: d3.extent(xValues, function(d) { return d; }),
        y: d3.extent(yValues, function(d) { return d; })
      };
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
      var dataChangeLine = [];
      var xValues = [];
      var xValuesInteger = [];
      var yValues = [];
      var solidLineGroup = this.svg.append('g')
        .attr('class', 'line-group')
        .attr('transform', 'translate('+ _this.defaults.paddingXAxisLabels +' ,'+ -this.defaults.paddingAxisLabels + ')');

      this.linePath = d3.svg.line()
        .x(function(d) {
          xValues.push(_this.x(d.date));
          xValuesInteger.push(parseInt(_this.x(d.date)));
          return _this.x(d.date);
        })
        .y(function(d) { yValues.push(_this.y(d.value)); return _this.y(d.value); })
        .interpolate(this.defaults.interpolate);

      this.defaults.yValues = yValues;
      this.defaults.xValues = xValues;
      this.defaults.xValuesInteger = xValuesInteger;

      if (this.defaults.treeCoverLossAlerts) {
        dataChangeLine.push({
          xValues: this.defaults.xValues,
          yValues: this.defaults.yValues,
          xValuesInteger: this.defaults.xValuesInteger,
          cid: this.cid,
        })

        mps.publish('Line/data', [dataChangeLine]);
      }

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
    },

    moveCircle: function(e) {
      var svg = $('.svg-'+this.cid);
      svg = svg[0];
      var x = d3.mouse(svg)[0];
      var position = 0;
      position =  this.defaults.xValuesInteger.indexOf(parseInt(x));
      if(position != -1) {
        mps.publish('Line/update', [position, this.dataTotal]);
      }
    },

    restartCircle: function(e) {
      mps.publish('Line/restart', [this.dataTotal]);
    },

  });

  return LineGraphView;

});
