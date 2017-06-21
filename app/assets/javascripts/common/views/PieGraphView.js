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
      outerRadius: 5,
      radiusInner: 35,
      removeTimeout: 300,
      resizeDone: false,
      totalValues: null,
      textValue: [],
      valuesFirstChart: [],
      valuesSecondChart: [],
      valuesPercentage: [],
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
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
      this.hasData = this.data && this.data.length;

      if (this.hasData) {
        this._start();
      } else {
        this._renderNoData();
      }

    },

    _start: function() {
      this.$el.html(this.template({
        hasData: this.data.length
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
      this._drawGraph();
      this._drawValues();
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
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .on('mousemove', this.appearTooltip)
          .on('mouseout', this.deleteTooltip);
    },

    appearTooltip: function() {
      var _this = $('.m-tooltip-country');
      var height = _this.height();
      var width = _this.width();
      _this.removeClass('-hidden');
      $(document).mousemove(function(e){
        _this.css('left', e.pageX - 45);
        _this.css('top', e.pageY - 110);
      });
    },

    deleteTooltip: function() {
      var _this = $('.m-tooltip-country');
      _this.addClass('-hidden');
    },

    /**
     * Draws the entire graph
     */
    _drawGraph: function() {
      var valuesFirstChart = [];
      var i = 0;
      var resizeDone = this.defaults.resizeDone;
      if (this.defaults.resizeDone) {
        valuesFirstChart = this.defaults.valuesFirstChart;
      }
      this.arc = d3.svg.arc()
        .outerRadius(this.radius)
        .innerRadius(this.defaults.radiusInner);

      var pie = d3.layout.pie()
        .value(function(d) {
          if(!resizeDone) {
            valuesFirstChart[i] = d.value;
          }
          i += 1;
          return valuesFirstChart[i-1];
        });

      this.defaults.valuesFirstChart = valuesFirstChart;

      var container = this.svg.append('g')
        .attr('class', 'container')
        .attr('transform', 'translate(' + (this.cWidth / 2) + ', ' +
          ((this.cHeight / 2)  - (this.defaults.margin.top / 2)) + ')');

      this.pie = container.selectAll('.arc')
        .data(pie(this.data))
        .enter().append('g')
          .attr('data-category', function(d) {
            return d.data.category;
          })
          .attr('class', 'arc')
          .on('mousemove', function(d) {
            var category = d.data.category;
            var percentage = this.defaults.valuesPercentage[category - 1].value;
            var totalThisValue = parseInt(d.value / 1000000);
            $('#title-tooltip').html(percentage+'%');
            $('#sub-title-tooltip').html(totalThisValue+'Ha');
          }.bind(this));

      this.pie.append('path')
        .attr('d', this.arc)
        .style('fill', function(d) { return d.data.color })
        .style('stoke', function(d) { return d.data.color })
        .transition()
        .duration(this.defaults.animationTime)
        .attrTween('d', this._tweenPie.bind(this));
    },

    _drawValues: function() {
      var totalPercentage = 0;
      var path = this.svg.selectAll('.arc');
      var i = 0;
      var resizeDone = this.defaults.resizeDone;
      var textValue = null;
      var value = 0;
      var valuePercentage = [];
      if (!this.defaults.resizeDone) {
        var textValue = [];
      } else {
        textValue = this.defaults.textValue;
      }

      if (!this.defaults.resizeDone) {
        this.defaults.totalValues = _.reduce(this.data, function(memo, num) {
          memo.value += num.value;
          return memo;
        });
      }
      var totalValues = this.defaults.totalValues;

      path.append('text')
        .attr('transform', function(d) {
          var c = this.arc.centroid(d);
          return 'translate(' + (c[0]-12) + ',' + (c[1]+8) + ')'
        }.bind(this))
        .text(function(d) {
          if (!resizeDone) {
            textValue[i] = d.value;
          }
          if (textValue.length === 3) {
              totalPercentage = Math.round((textValue[0] * 100) / totalValues.value) + Math.round((textValue[1] * 100) / totalValues.value) + Math.round((textValue[2] * 100) / totalValues.value);
              totalPercentage = 100 - totalPercentage;
          }
          value = Math.round((textValue[i] * 100) / totalValues.value);
          if (totalPercentage > 0) {
            value = value + totalPercentage;
          }
          if (totalPercentage < 0) {
            value = value - totalPercentage;
          }
          i += 1;
          valuePercentage.push({value: value})
          if (value > 0) return value + '%'
        })
        .attr('class', 'label');
        this.defaults.valuesPercentage = valuePercentage;
        this.defaults.textValue = textValue;
        this.defaults.resizeDone = true;
    },

    /**
     * Animation event
     */
    _tweenPie: function(finish) {
      var start = {
        startAngle: 0,
        endAngle: 0
      };
      var i = d3.interpolate(start, finish);

      return function(d) { return this.arc(i(d)); }.bind(this);
    },

    /**
     * Animation event
     */
    _tweenPieOut: function(b) {
      var start = {
        startAngle: b.startAngle,
        endAngle: b.endAngle
      };

      b.startAngle = 0;
      b.endAngle = 0;
      b.value = 0;

      var i = d3.interpolate(start, b);
      return function(t) {
        return this.arc(i(t));
      }.bidn(this);
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
