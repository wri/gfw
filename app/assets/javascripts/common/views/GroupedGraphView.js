define([
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'moment',
  'text!common/templates/groupedGraph.handlebars'
], function(
  Backbone,
  _,
  Handlebars,
  d3,
  moment,
  tpl
) {

  'use strict';

  var GroupedGraphView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    defaults: {
      chartEl: 'grouped-graph-svg',
      chartClass: 'js-grouped-graph',
      paddingAxisLabels: 10,
      paddingXAxisLabels: 50,
      paddingYAxisLabels: 10,
      margin: {
        top: 20,
        right: 5,
        bottom: 35,
        left: 40
      }
    },

    initialize: function(settings) {
      this.defaults = _.extend({}, this.defaults, settings);
      this.data = this.defaults.data;
      this.bucket = this.defaults.bucket;
      this.defaultIndicator = this.defaults.defaultIndicator;

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
        hasData: true //this.chartData.length
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
      this._setupAxis();
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
      this.chartData = this.data;
      this.options = d3.keys(this.chartData[0]).filter(function(key) {
        return key !== 'label';
      });

      this.options = _.sortBy(this.options, function(option) {
        return option !== this.defaultIndicator;
      }.bind(this));

      this.chartData.forEach(function(d, i) {
        d.values = this.options.map(function(name) {
          return { name: name, value: +d[name] };
        }.bind(this));
      }.bind(this));
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

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;

      var svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right + 'px')
        .attr('height', this.cHeight + margin.top + margin.bottom + 'px')
        .on('mouseout', this.deleteTooltip);

      this.svg = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    deleteTooltip: function() {
      var _this = $('.m-tooltip-country');
      _this.addClass('-hidden');
      _this.removeClass('-group');
    },

    /**
     *  Sets the axis
     */
    _setAxisScale: function() {
      this.x0 = d3.scale.ordinal()
        .rangeRoundBands([0, this.cWidth], .3);

      this.x1 = d3.scale.ordinal();

      this.y = d3.scale.linear()
        .range([this.cHeight, 0]).nice();
    },

    _setDomain: function() {
      this.x0.domain(this.chartData.map(function(d) {
        return d.label;
      }));
      this.x1.domain(this.options).rangeRoundBands([0, this.x0.rangeBand()]);
      this.y.domain([0, d3.max(this.chartData, function(d) {
        return d3.max(d.values, function(d) {
          return d.value;
        });
      })]);
    },

    _setupAxis: function() {
      this.xAxis = d3.svg.axis()
        .scale(this.x0)
        .tickPadding(5)
        .tickValues(this.x0.domain().filter(function(d, i) { return !(i % 2); }))
        .outerTickSize(0)
        .orient('bottom');

      this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient('left')
        .tickPadding(8)
        .innerTickSize(-this.cWidth)
        .tickFormat(d3.format('.1s'));
    },

    /**
     * Draws the axis
     */
    _drawAxis: function() {
      this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.cHeight + ')')
        .call(this.xAxis);

      this.svg.append('g')
        .attr('class', 'y axis')
        .call(this.yAxis);
    },

    /**
     * Draws the entire graph
     */
    _drawGraph: function() {
      var widthBar = 5;
      if(this.chartData.length < 6) {
        widthBar = 10;
      }
      var bar = this.svg.selectAll('.bar')
        .data(this.chartData)
        .enter().append('g')
        .attr('class', 'rect')
        .attr('transform', function(d) {
          return 'translate(' + this.x0(d.label) + ', 0)';
        }.bind(this))
        .on('mousemove', function(d) {
          var _this = $('.m-tooltip-country');
          _this.removeClass('-hidden');
          _this.addClass('-group');
          $(document).mousemove(function(e){
            _this.css('left', e.pageX - ((_this.width() + 15) / 2));
            _this.css('top', e.pageY - 110);
          });
          $('#title-tooltip').html(parseInt(d.loss).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+ ' <span class="unit-text">Ha</span>');
          $('#sub-title-tooltip').html(parseInt(d.wdpa).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+ ' <span class="unit-text -small">Ha</span>');
        }.bind(this));

      bar.selectAll('rect')
        .data(function(d) { return d.values; })
        .enter().append('rect')
        .attr('width', widthBar)
        .attr('x', function(d) { return this.x1(d.name); }.bind(this))
        .attr('y', function(d) { return this.y(d.value); }.bind(this))
        .attr('value', function(d) {return d.name;})
        .attr('height', function(d) { return this.cHeight - this.y(d.value); }.bind(this))
        .style('fill', function(d) { return this.bucket[d.name] || '#2681bf'; }.bind(this));
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

    updateChart: function(params) {
      this.data = params.data;
      this.bucket = params.bucket;
      this.remove({
        keepEvents: true
      });
      this._initChart();
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

  return GroupedGraphView;

});
