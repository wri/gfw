define([
  'jquery',
  'd3',
  'Class'
], function($, d3, Class) {

  'use strict';

  var CLASSES = ['one', 'two', 'three', 'four'];

  var ForestTenureGraph = Class.extend({
    init: function(options) {
      this.options = options;
      this.data = options.data;

      this.el = options.el[0];
      this.$el = $(options.el);

      this.height = this.data.length * 50;
      this.width = this.$el.outerWidth() - 80;

      this._createScales();
      this._createSvg();

      this.render();
    },

    render: function() {
      this._drawLines();
      this._drawLines();
      this._drawValues();
      this._drawLegend();
    },

    _createScales: function() {
      var max = _.max(_.pluck(this.data, 'percent'));
      var extent = [0, max];
      this.scale = d3.scale.linear()
        .range([0, 500])
        .domain(extent);
    },

    _createSvg: function() {
      this.svg = d3.select(this.el)
        .append('svg')
        .attr('height', this.height);
    },

    _drawLines: function() {
      this.svg.selectAll('rect')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('class', function(d, i) {
          return CLASSES[i];
        })
        .attr('x', function() {
          return this.scale(0);
        }.bind(this))
        .attr('y', function(d, i) {
          return 25 + (50 * i);
        })
        .attr('width', function(d) {
          var width = this.scale(d['percent']);
          return width > this.width ? this.width : width;
        }.bind(this))
        .attr('height', 4)
        .attr('rx', 2)
        .attr('ry', 2);
    },

    _drawLineEnds: function() {
      this.svg.selectAll('circle')
        .data(this.data)
        .enter()
        .append('svg:circle')
        .attr('class', function(d, i) {
          return CLASSES[i];
        })
        .attr('cx', function(d, i) {
          var x = this.scale(d['percent']);
          return x > this.width ? this.width : x;
        }.bind(this))
        .attr('cy', function(d, i) {
          return 27 + (50 * i);
        })
        .attr('r', 5);
    },

    _drawValues: function() {
      this.svg.selectAll('.units')
        .data(this.data)
        .enter()
        .append('text')
        .text(this.options.valueFormatter)
        .attr('class', function(d, i) {
          return 'units ' + CLASSES[i];
        })
        .attr('x', function(d, i) {
          var x = this.scale(d['percent'])+10;
          return x > (this.width + 10) ? (this.width + 10) : x;
        }.bind(this))
        .attr('y', function(d, i) {
          return 31 + (50 * i);
        });
    },

    _drawLegend: function() {
      this.svg.selectAll('.legend')
        .data(this.data)
        .enter()
        .append('text')
        .text(function(d) {
          return d['name'];
        })
        .attr('class', function(d, i) {
          return 'legend ' + CLASSES[i];
        })
        .attr('x', 0)
        .attr('y', function(d, i) {
          return 15 + (50 * i);
        });
    }
  });

  return ForestTenureGraph;

});
