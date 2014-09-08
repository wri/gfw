//= require d3/d3
//= require jquery.qtip.min
//= require simple_statistics

gfw.ui.model.CountriesEmbedOverview = cdb.core.Model.extend({
  defaults: {
    graph: 'total_loss',
    years: true,
    class: null
  }
});


gfw.ui.view.CountriesEmbedOverview = cdb.core.View.extend({
  el: document.body,

  events: {
    'click .graph_tab': '_updateGraph'
  },

  initialize: function() {
    this.model = new gfw.ui.model.CountriesEmbedOverview();

    this.$graph = $('.overview_graph__area');
    this.$years = $('.overview_graph__years');

    var m = this.m = 40,
        w = this.w = this.$graph.width()+(m*2),
        h = this.h = this.$graph.height(),
        vertical_m = this.vertical_m = 20;

    this.x_scale = d3.scale.linear()
      .range([m, w-m])
      .domain([2001, 2012]);

    this.grid_scale = d3.scale.linear()
      .range([vertical_m, h-vertical_m])
      .domain([0, 1]);

    this.model.bind('change:graph', this._redrawGraph, this);
    this.model.bind('change:years', this._toggleYears, this);
    this.model.bind('change:class', this._toggleClass, this);

    this._initViews();
  },

  _initViews: function() {
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip');

    this._drawYears();
    this._drawGraph();
  },

  _toggleYears: function() {
    var that = this;

    if(this.model.get('years') === false) {
      this.$years.slideUp(250, function() {
        $('.overview_graph__axis').slideDown();
      });
    } else {
      $('.overview_graph__axis').slideUp(250, function() {
        that.$years.slideDown();
      });
    }
  },

  _showYears: function() {
    if (!this.model.get('years')) {
      this.model.set('years', true);
    }
  },

  _hideYears: function() {
    if (this.model.get('years')) {
      this.model.set('years', false);
    }
  },

  _updateGraph: function(e) {
    e.preventDefault();

    var $target = $(e.target).closest('.graph_tab'),
        graph = $target.attr('data-slug');

    if (graph === this.model.get('graph')) {
      return;
    } else {
      $('.graph_tab').removeClass('selected');
      $target.addClass('selected');

      this.model.set('graph', graph);
    }
  },

  _redrawGraph: function() {
    var graph = this.model.get('graph');

    $('.overview_graph__title').html(config.GRAPHS[graph].title);
    $('.overview_graph__legend p').html(config.GRAPHS[graph].subtitle);
    $('.overview_graph__legend .info').attr('data-source', graph);

    this.$graph.find('.'+graph);

    this.$graph.find('.chart').hide();
    this.$graph.find('.'+graph).fadeIn();

    this._drawGraph();
  },

  _drawYears: function() {
    var markup_years = '';

    for (var y = 2001; y<=2012; y += 1) {
      var y_ = this.x_scale(y);

      if (y === 2001) {
        y_ -= 25;
      } else if (y === 2012) {
        y_ -= 55;
      } else {
        y_ -= 40;
      }

      markup_years += '<span class="year" style="left:'+y_+'px">'+y+'</span>';
    }

    this.$years.html(markup_years);
  },

  _drawGraph: function() {
    var that = this;

    var w = this.w,
        h = this.h,
        vertical_m = this.vertical_m,
        m = this.m,
        x_scale = this.x_scale;

    var grid_scale = d3.scale.linear()
      .range([vertical_m, h-vertical_m])
      .domain([1, 0]);

    d3.select('#chart').remove();

    var svg = d3.select('.overview_graph__area')
      .append('svg:svg')
      .attr('id', 'chart')
      .attr('width', w)
      .attr('height', h);

    // grid
    svg.selectAll('line.grid_h')
      .data(grid_scale.ticks(4))
      .enter()
      .append('line')
      .attr({
        'class': 'grid grid_h',
        'x1': 0,
        'x2': w,
        'y1': function(d, i) { return grid_scale(d); },
        'y2': function(d, i) { return grid_scale(d); }
      });

    svg.selectAll('line.grid_v')
      .data(x_scale.ticks(12))
      .enter()
      .append('line')
      .attr({
        'class': 'grid grid_v',
        'y1': h,
        'y2': 0,
        'x1': function(d) { return x_scale(d); },
        'x2': function(d) { return x_scale(d); }
      });

    var gradient = svg.append('svg:defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad');

    gradient.append('svg:stop')
      .attr('offset', '0%')
      .attr('stop-color', '#CA46FF')
      .attr('stop-opacity', .5);

    gradient.append('svg:stop')
      .attr('offset', '100%')
      .attr('stop-color', '#D24DFF')
      .attr('stop-opacity', 1);

    if (this.model.get('graph') === 'total_loss') {
      this._showYears();

      svg.append('text')
        .attr('class', 'axis')
        .attr('id', 'axis_y')
        .text('Mha')
        .attr('x', -h/2)
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

      var sql = 'SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'SUM(y'+y+') as y'+y+', '
      }

      sql += 'SUM(y2012) as y2012, (SELECT SUM(y2001_y2012)\
                                    FROM countries_gain) as gain\
              FROM loss_gt_0';

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(error, json) {
        var data = json.rows[0];

        var data_ = [],
            gain = null;

        _.each(data, function(val, key) {
          if (key === 'gain') {
            gain = val/12;
          } else {
            data_.push({
              'year': key.replace('y',''),
              'value': val
            });
          }
        });

        var y_scale = d3.scale.linear()
          .range([vertical_m, h-vertical_m])
          .domain([d3.max(data_, function(d) { return d.value; }), 0]);

        // area
        var area = d3.svg.area()
          .x(function(d) { return x_scale(d.year); })
          .y0(h)
          .y1(function(d) { return y_scale(d.value); });

        svg.append('path')
          .datum(data_)
          .attr('class', 'area')
          .attr('d', area)
          .style('fill', 'url(#gradient)');

        // circles
        svg.selectAll('circle')
          .data(data_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>'+d.year+'</span>'+formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });

        var data_gain_ = [
          {
            year: 2001,
            value: gain
          },
          {
            year: 2012,
            value: gain
          }
        ];

        // line
        svg.selectAll('line.overview_line')
          .data(data_gain_)
          .enter()
          .append('line')
          .attr({
            'class': 'overview_line',
            'x1': m,
            'x2': w-m,
            'y1': function(d) { return y_scale(gain); },
            'y2': function(d) { return y_scale(gain); }
          });

        svg.selectAll('circle.gain')
          .data(data_gain_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot gain')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>2001-2012</span>'+formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip gain_tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });
      });
    } else if (this.model.get('graph') === 'percent_loss') {
      this._showYears();

      svg.append('text')
        .attr('class', 'axis')
        .attr('id', 'axis_y')
        .text('%')
        .attr('x', -h/2)
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

      var sql = 'WITH loss as (SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'SUM(y'+y+') as sum_loss_y'+y+', ';
      }

      sql += 'SUM(y2012) as sum_loss_y2012\
              FROM loss_gt_25), extent as (SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'SUM(y'+y+') as sum_extent_y'+y+', ';
      }

      sql += 'SUM(y2012) as sum_extent_y2012\
              FROM extent_gt_25)\
              SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'sum_loss_y'+y+'/sum_extent_y'+y+' as percent_loss_'+y+', ';
      }

      sql += 'sum_loss_y2012/sum_extent_y2012 as percent_loss_2012, (SELECT SUM(y2001_y2012)/(';

      for(var y = 2001; y < 2012; y++) {
        sql += 'sum_extent_y'+y+' + ';
      }

      sql += 'sum_extent_y2012)\
              FROM countries_gain) as gain\
              FROM loss, extent';

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
        var data = json.rows[0];

        var data_ = [],
            gain = null;

        _.each(data, function(val, key) {
          if (key === 'gain') {
            gain = val/12;
          } else {
            data_.push({
              'year': key.replace('percent_loss_',''),
              'value': val
            });
          }
        });

        var y_scale = grid_scale;

        // area
        var area = d3.svg.area()
          .x(function(d) { return x_scale(d.year); })
          .y0(h)
          .y1(function(d) { return y_scale(d.value*100); });

        svg.append('path')
          .datum(data_)
          .attr('class', 'area')
          .attr('d', area)
          .style('fill', 'url(#gradient)');

        // circles
        svg.selectAll('circle')
          .data(data_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value*100);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>'+d.year+'</span>'+parseFloat(d.value*100).toFixed(2)+' %';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });

        var data_gain_ = [
          {
            year: 2001,
            value: gain
          },
          {
            year: 2012,
            value: gain
          }
        ];

        // line
        svg.selectAll('line.overview_line')
          .data(data_gain_)
          .enter()
          .append('line')
          .attr({
            'class': 'overview_line',
            'x1': m,
            'x2': w-m,
            'y1': function(d) { return y_scale(gain*100); },
            'y2': function(d) { return y_scale(gain*100); }
          });

         // circles
        svg.selectAll('circle.gain')
          .data(data_gain_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot gain')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value*100);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>2001-2012</span>'+parseFloat(d.value*100).toFixed(2)+' %';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip gain_tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });
      });
    } else if (this.model.get('graph') === 'total_extent') {
      this._showYears();

      svg.append('text')
        .attr('class', 'axis')
        .attr('id', 'axis_y')
        .text('Mha')
        .attr('x', -h/2)
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

      var gradient_extent = svg.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient_extent')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

      gradient_extent.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#98BD17')
        .attr('stop-opacity', .5);

      gradient_extent.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#98BD17')
        .attr('stop-opacity', 1);

      var sql = 'SELECT ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'SUM(loss.y'+y+') as loss_y'+y+', ';
      }

      sql += 'SUM(loss.y2012) as loss_y2012, ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'SUM(extent.y'+y+') as extent_y'+y+', ';
      }

      sql += 'SUM(extent.y2012) as extent_y2012\
              FROM loss_gt_25 loss, extent_gt_25 extent\
              WHERE loss.iso = extent.iso';

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
        var data = json.rows[0];

        var data_ = [],
            data_loss_ = [],
            data_extent_ = [];

        _.each(data, function(val, key) {
          var year = key.split('_y')[1];

          var obj = _.find(data_, function(obj) { return obj.year == year; });

          if(obj === undefined) {
            data_.push({ 'year': year });
          }

          if (key.indexOf('loss_y') != -1) {
            data_loss_.push({
              'year': key.split('_y')[1],
              'value': val
            });
          }

          if (key.indexOf('extent_y') != -1) {
            data_extent_.push({
              'year': key.split('extent_y')[1],
              'value': val
            });
          }
        });

        _.each(data_, function(val) {
          var loss = _.find(data_loss_, function(obj) { return obj.year == val.year; }),
              extent = _.find(data_extent_, function(obj) { return obj.year == val.year; });

          _.extend(val, { 'loss': loss.value, 'extent': extent.value });
        });

        var domain = [d3.max(data_, function(d) { return d.extent; }), 0];

        var y_scale = d3.scale.linear()
          .range([vertical_m, h-vertical_m])
          .domain(domain);

        // area
        var area_loss = d3.svg.area()
          .x(function(d) { return x_scale(d.year); })
          .y0(h)
          .y1(function(d) { return y_scale(d.loss); });

        var area_extent = d3.svg.area()
          .x(function(d) { return x_scale(d.year); })
          .y0(function(d) { return y_scale(d.extent); })
          .y1(function(d) { return y_scale(d.loss); });

        svg.append('path')
          .datum(data_)
          .attr('class', 'area')
          .attr('d', area_loss)
          .style('fill', 'url(#gradient)');

        svg.append('path')
          .datum(data_)
          .attr('class', 'area')
          .attr('d', area_extent)
          .style('fill', 'url(#gradient_extent)');

        // circles
        svg.selectAll('circle')
          .data(data_loss_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>'+d.year+'</span>'+formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });

        svg.selectAll('circle.gain')
          .data(data_extent_)
          .enter()
          .append('svg:circle')
          .attr('class', 'linedot gain')
          .attr('cx', function(d) {
            return x_scale(d.year);
          })
          .attr('cy', function(d){
            return y_scale(d.value);
          })
          .attr('r', 6)
          .attr('name', function(d) {
            return '<span>'+d.year+'</span>'+formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
          })
          .on('mouseover', function(d) {
            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', $(this).offset().top-100+'px')
              .style('left', $(this).offset().left-$('.tooltip').width()/2-4+'px')
              .attr('class', 'tooltip gain_tooltip');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 7);

            // TODO: highlighting the legend
          })
          .on('mouseout', function(d) {
            that.tooltip.style('visibility', 'hidden');

            d3.select(this)
              .transition()
              .duration(100)
              .attr('r', 6);

            // TODO: highlighting the legend
          });
      });
    } else if (this.model.get('graph') === 'ratio') {
      this._hideYears();

      svg.append('text')
        .attr('class', 'axis light')
        .attr('id', 'axis_y')
        .text('Cover gain 2001-2012')
        .attr('x', -(h/2))
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

      var shadow = svg.append('svg:defs')
        .append('svg:filter')
        .attr('id', 'shadow')
        .attr('x', '0%')
        .attr('y', '0%')
        .attr('width', '200%')
        .attr('height', '200%')

      shadow.append('svg:feOffset')
        .attr('result', 'offOut')
        .attr('in', 'SourceAlpha')
        .attr('dx', 0)
        .attr('dy', 0);

      shadow.append('svg:feGaussianBlur')
        .attr('result', 'blurOut')
        .attr('in', 'offOut')
        .attr('stdDeviation', 1);

      shadow.append('svg:feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'blurOut')
        .attr('mode', 'normal');

        var sql = 'WITH loss as (SELECT iso, SUM(';

        for(var y = 2001; y < 2012; y++) {
          sql += 'loss.y'+y+' + ';
        }

        sql += 'loss.y2012) as sum_loss\
                FROM loss_gt_50 loss\
                GROUP BY iso), gain as (SELECT g.iso, SUM(y2001_y2012) as sum_gain\
                                        FROM countries_gain g, loss_gt_50 loss\
                                        WHERE loss.iso = g.iso\
                                        GROUP BY g.iso), ratio as (';

        sql += 'SELECT c.iso, c.name, c.enabled, loss.sum_loss as loss, gain.sum_gain as gain, loss.sum_loss/gain.sum_gain as ratio\
                FROM loss, gain, gfw2_countries c\
                WHERE sum_gain IS NOT null\
                AND NOT sum_gain = 0\
                AND c.iso = gain.iso\
                AND c.iso = loss.iso\
                ORDER BY loss.sum_loss DESC\
                LIMIT 50) ';

        sql += 'SELECT *\
                FROM ratio\
                WHERE ratio IS NOT null\
                ORDER BY ratio DESC';

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
        var data = json.rows;

        var log_m = 50;

        var y_scale = d3.scale.linear()
          .range([h, 0])
          .domain([0, d3.max(data, function(d) { return d.gain; })]);

        var x_scale = d3.scale.linear()
          .range([m, w-m])
          .domain([d3.min(data, function(d) { return d.loss; }), d3.max(data, function(d) { return d.loss; })]);

        var x_log_scale = d3.scale.log()
          .range([m, w-m])
          .domain([d3.min(data, function(d) { return d.loss; }), d3.max(data, function(d) { return d.loss; })]);

        var y_log_scale = d3.scale.log()
          .range([h-log_m, m])
          .domain([d3.min(data, function(d) { return d.gain; }), d3.max(data, function(d) { return d.gain; })]);

        var r_scale = d3.scale.linear()
          .range(['yellow', 'red'])
          .domain([0, d3.max(data, function(d) { return d.ratio; })]);

        that.linearRegressionLine(svg, json, x_scale, y_scale);

        // circles w/ magic numbers :(
        var circle_attr = {
          'cx': function(d) { return d.loss >= 1 ? x_log_scale(d.loss) : m; },
          'cy': function(d) { return d.gain >= 1 ? y_log_scale(d.gain) : h-log_m; },
          'r': '5',
          'name': function(d) { return d.name; },
          'class': function(d) { return d.enabled ? 'ball ball_link' : 'ball ball_nolink'; }
        };

        var data_ = [],
            data_link_ = [],
            exclude = ['Saint Barthélemy', 'Saint Kitts and Nevis',
                       'Saint Pierre and Miquelon', 'Virgin Islands', 'Oman',
                       'Gibraltar', 'Saudi Arabia', 'French Polynesia',
                       'Samoa', 'Western Sahara', 'United Arab Emirates'];

        _.each(data, function(row) {
          if (!_.contains(exclude, row.name)) {
            if (row.enabled === true) {
              data_link_.push(row);
            } else {
              data_.push(row);
            }
          }
        });

        var circles_link = svg.selectAll('circle.ball_link')
          .data(data_link_)
          .enter()
          .append('a')
          .attr('xlink:href', function(d) { return '/country/' + d.iso })
          .attr('target', '_blank')
          .append('svg:circle')
          .attr(circle_attr)
          .style('fill', function(d) {
            return r_scale(d.ratio);
          })
          .style('filter', 'url(#shadow)')
          .on('mouseover', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '7')
              .style('opacity', 1);

            var t = $(this).offset().top - 80,
                l = $(this).offset().left,
                r = $(this).attr('r'),
                tip = $('.tooltip').width()/2;

            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', parseInt(t, 10)+'px')
              .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
              .attr('class', 'tooltip gain_tooltip');
          })
          .on('mouseenter', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '7')
              .style('opacity', 1);

            var t = $(this).offset().top - 80,
                l = $(this).offset().left,
                r = $(this).attr('r'),
                tip = $('.tooltip').width()/2;

            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', parseInt(t, 10)+'px')
              .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)+'px')
              .attr('class', 'tooltip gain_tooltip');
          })
          .on('mouseout', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '5')
              .style('opacity', .8);

            that.tooltip.style('visibility', 'hidden');
          });

        var circles = svg.selectAll('circle.ball_nolink')
          .data(data_)
          .enter()
          .append('svg:circle')
          .attr(circle_attr)
          .style('filter', 'url(#shadow)')
          .on('mouseover', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '7')
              .style('opacity', 1);

            var t = $(this).offset().top - 80,
                l = $(this).offset().left,
                r = $(this).attr('r'),
                tip = $('.tooltip').width()/2;

            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', parseInt(t, 10)+'px')
              .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
              .attr('class', 'tooltip gain_tooltip');
          })
          .on('mouseenter', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '7')
              .style('opacity', 1);

            var t = $(this).offset().top - 80,
                l = $(this).offset().left,
                r = $(this).attr('r'),
                tip = $('.tooltip').width()/2;

            that.tooltip.html($(this).attr('name'))
              .style('visibility', 'visible')
              .style('top', parseInt(t, 10)+'px')
              .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)+'px')
              .attr('class', 'tooltip gain_tooltip');
          })
          .on('mouseout', function() {
            d3.select(d3.event.target)
              .transition()
              .attr('r', '5')
              .style('opacity', .8);

            that.tooltip.style('visibility', 'hidden');
          });
      });
    } else if (this.model.get('graph') === 'domains') {
      this._showYears();

      var sql = 'SELECT name, ';

      for(var y = 2001; y < 2012; y++) {
        sql += 'y'+y+', '
      }

      sql += 'y2012, GREATEST('

      for(var y = 2001; y < 2012; y++) {
        sql += 'y'+y+', '
      }

      sql += 'y2012) as max\
              FROM countries_domains';

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(error, json) {
        var data = json.rows;

        var r_scale = d3.scale.linear()
          .range([5, 30]) // max ball radius
          .domain([0, d3.max(data, function(d) { return d.max; })])

        for(var j = 0; j < data.length; j++) {
          var data_ = [],
              domain = '';

          _.each(data[j], function(val, key) {
            if (key !== 'max') {
              if (key === 'name') {
                domain = val.toLowerCase();
              } else {
                data_.push({
                  'year': key.replace('y',''),
                  'value': val
                });
              }
            }
          });

          svg.append('text')
            .attr('class', 'label')
            .attr('id', 'label_'+domain)
            .text(domain)
            .attr('x', function() {
              var l = x_scale(2002) - $(this).width()/2;

              return l;
            })
            .attr('y', (h/5)*(j+.6));

          var circle_attr = {
            'cx': function(d, i) { return x_scale(2001 + i); },
            'cy': function(d) { return (h/5)*(j+1); },
            'r': function(d) { return r_scale(d.value); },
            'class': function(d) { return 'ball'; }
          };

          svg.selectAll('circle.domain_'+domain)
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr(circle_attr)
            .attr('data-slug', domain)
            .attr('name', function(d) {
              return '<span>'+d.year+'</span>'+formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
            })
            .style('fill', function(d) { return config.GRAPHCOLORS[domain]; })
            .on('mouseover', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', function(d) { return circle_attr.r(d) + 2; })
                .style('opacity', 1);

              var t = $(this).offset().top - 100,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip').width()/2,
                  slug = $(this).attr('data-slug');

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                .attr('class', 'tooltip')
                .attr('data-slug', 'tooltip')
                .style('color', function() {
                  if (slug === 'subtropical') {
                    return '#FFC926'
                  } else {
                    return config.GRAPHCOLORS[slug];
                  }
                });
            })
            .on('mouseenter', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', function(d) { return circle_attr.r(d) + 2; })
                .style('opacity', 1);

              var t = $(this).offset().top - 80,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip').width()/2,
                  slug = $(this).attr('data-slug');

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                .attr('class', 'tooltip')
                .attr('data-slug', 'tooltip')
                .style('color', function() {
                  if (domain === 'subtropical') { return config.GRAPHCOLORS[domain]; }
                });
            })
            .on('mouseout', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', function(d) { return circle_attr.r(d); })
                .style('opacity', .8);

              that.tooltip
                .style('color', '')
                .style('visibility', 'hidden');
            });
        }
      });
    }
  },

  linearRegressionLine: function(svg, dataset, x_log_scale, y_log_scale) {
    var that = this;

    // linear regresion line
    var lr_line = ss.linear_regression()
      .data(dataset.rows.map(function(d) { return [d.loss, d.gain]; }))
      .line();

    var line = d3.svg.line()
      .x(x_log_scale)
      .y(function(d) { return that.y_log_scale(lr_line(d));} )

    var x0 = x_log_scale.domain()[0];
    var x1 = x_log_scale.domain()[1];
    var lr = svg.selectAll('.linear_regression').data([0]);

    var attrs = {
       "x1": x_log_scale(x0),
       "y1": y_log_scale(lr_line(x0)),
       "x2": x_log_scale(x1),
       "y2": y_log_scale(lr_line(x1)),
       "stroke-width": 1.3,
       "stroke": "white",
       "stroke-dasharray": "7,5"
    };

    lr.enter()
      .append("line")
       .attr('class', 'linear_regression')
       .attr(attrs);

    lr.transition().attr(attrs);
  }
});


gfw.ui.view.CountriesEmbedShow = cdb.core.View.extend({
  el: document.body,

  events: {
    'click .forma_dropdown-link': '_openDropdown',
    'click .hansen_dropdown-link': '_openDropdown',
    'click .hansen_dropdown-menu a': '_redrawCircle'
  },

  initialize: function() {
    this.iso = this.options.iso;

    this._initViews();
    this._initHansenDropdown();
  },

  _initViews: function() {
    this._drawCircle('forma', 'lines', { iso: this.iso });
    this._drawCircle('forest_loss', 'bars', { iso: this.iso, dataset: 'loss' });
  },

  _initFormaDropdown: function() {
    $('.forma_dropdown-link').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.forma_dropdown-menu')
      },
      position: {
        my: 'bottom right',
        at: 'top right',
        target: $('.forma_dropdown-link'),
        adjust: {
          x: -10
        }
      },
      style: {
        tip: {
          corner: 'bottom right',
          mimic: 'bottom center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });
  },

  _initHansenDropdown: function() {
    this.dropdown = $('.hansen_dropdown-link').qtip({
      show: 'click',
      hide: {
        event: 'click unfocus'
      },
      content: {
        text: $('.hansen_dropdown-menu')
      },
      position: {
        my: 'top right',
        at: 'bottom right',
        target: $('.hansen_dropdown-link'),
        adjust: {
          x: 10
        }
      },
      style: {
        tip: {
          corner: 'top right',
          mimic: 'top center',
          border: 1,
          width: 10,
          height: 6
        }
      }
    });
  },

  _openDropdown: function(e) {
    e.preventDefault();
  },

  _redrawCircle: function(e) {
    e.preventDefault();

    var dataset = $(e.target).attr('data-slug'),
        subtitle = $(e.target).text();

    var api = this.dropdown.qtip('api');

    api.hide();

    $('.hansen_dropdown-link').html(subtitle);

    if(dataset === 'countries_gain') {
      this._drawCircle('forest_loss', 'comp', { iso: this.iso });
    } else {
      this._drawCircle('forest_loss', 'bars', { iso: this.iso, dataset: dataset });
    }
  },

  _drawCircle: function(id, type, options) {
    var that = this;

    var $graph = $('.'+id),
        $amount = $('.'+id+' .graph-amount'),
        $date = $('.'+id+' .graph-date'),
        $coming_soon = $('.'+id+' .coming_soon'),
        $action = $('.'+id+' .action');

    $('.graph.'+id+' .frame_bkg').empty();
    $graph.addClass('ghost');
    $amount.html('');
    $date.html('');
    $coming_soon.hide();

    var width     = options.width     || 256,
        height    = options.height    || width,
        h         = 100, // maxHeight
        radius    = width / 2;

    var graph = d3.select('.graph.'+id+' .frame_bkg')
      .append('svg:svg')
      .attr('class', type)
      .attr('width', width)
      .attr('height', height);

    var dashedLines = [
      { x1:17, y:height/4, x2:239, color: '#ccc' },
      { x1:0, y:height/2, x2:width, color: '#ccc' },
      { x1:17, y:3*height/4, x2:239, color: '#ccc' }
    ];

    // Adds the dotted lines
    _.each(dashedLines, function(line) {
      graph.append('svg:line')
      .attr('x1', line.x1)
      .attr('y1', line.y)
      .attr('x2', line.x2)
      .attr('y2', line.y)
      .style('stroke-dasharray', '2,2')
      .style('stroke', line.color);
    });

    var sql = ["SELECT date_trunc('month', date) as date, COUNT(*) as alerts",
               'FROM forma_api',
               "WHERE iso = '"+options.iso+"'",
               "GROUP BY date_trunc('month', date)",
               "ORDER BY date_trunc('month', date) ASC"].join(' ');

    if (type === 'lines') {
      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {
        if(json && json.rows.length > 0) {
          $graph.removeClass('ghost');
          $action.removeClass('disabled');
          that._initFormaDropdown();

          var data = json.rows.slice(1, json.rows.length - 1);
        } else {
          $coming_soon.show();

          return;
        }

        var x_scale = d3.scale.linear()
          .domain([0, data.length - 1])
          .range([0, width - 80]);

        var max = d3.max(data, function(d) { return parseFloat(d.alerts); });

        if (max === d3.min(data, function(d) { return parseFloat(d.alerts); })) {
          h = h/2;
        }

        var y_scale = d3.scale.linear()
          .domain([0, max])
          .range([0, h]);

        var line = d3.svg.line()
          .x(function(d, i) { return x_scale(i); })
          .y(function(d, i) { return h - y_scale(d.alerts); })
          .interpolate('basis');

        var marginLeft = 40,
            marginTop = radius - h/2;

        $amount.html('<span>'+formatNumber(data[data.length - 1].alerts)+'</span>');

        var date = new Date(data[data.length - 1].date),
            form_date = 'Alerts in ' + config.MONTHNAMES[date.getMonth()] + ' ' + date.getFullYear();

        $date.html(form_date);

        graph.append('svg:path')
          .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
          .attr('d', line(data))
          .on('mousemove', function(d) {
            var index = Math.round(x_scale.invert(d3.mouse(this)[0]));

            if (data[index]) { // if there's data
              $amount.html('<span>'+formatNumber(data[index].alerts)+'</span>');

              var date = new Date(data[index].date),
                  form_date = 'Alerts in ' + config.MONTHNAMES[date.getMonth()] + ' ' + date.getFullYear();

              $date.html(form_date);

              var cx = d3.mouse(this)[0] + marginLeft;
              var cy = h - y_scale(data[index].alerts) + marginTop;

              graph.select('.forma_marker')
                .attr('cx', cx)
                .attr('cy', cy);
            }
          });

        graph.append('svg:circle')
          .attr('class', 'forma_marker')
          .attr('cx', -10000)
          .attr('cy',100)
          .attr('r', 5);
      });
    } else if (type === 'bars') {
      var sql = "SELECT ";

      if (options.dataset === 'loss') {
        sql += "year, loss_gt_0 loss FROM umd WHERE iso='"+options.iso+"'";
      } else if (options.dataset === 'extent') {
        sql += "year, extent_gt_25 extent FROM umd WHERE iso='"+options.iso+"'";
      }

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {
        if(json) {
          $graph.removeClass('ghost');

          var data = json.rows;
        } else {
          $coming_soon.show();

          return;
        }

        var data_ = [];

        _.each(data, function(val, key) {
          if (val.year >= 2001) {
            data_.push({
              'year': val.year,
              'value': eval('val.'+options.dataset)
            });
          }
        });

        $amount.html('<span>'+formatNumber(parseInt(data_[data_.length - 1].value, 10))+'</span>');
        $date.html('Hectares in ' + data_[data_.length - 1].year);

        var marginLeft = 40,
            marginTop = radius - h/2 + 5;

        var y_scale = d3.scale.linear()
          .domain([0, d3.max(data_, function(d) { return parseFloat(d.value); })])
          .range([height, marginTop*2]);

        var barWidth = (width - 80) / data_.length;

        var bar = graph.selectAll('g')
          .data(data_)
          .enter()
          .append('g')
          .attr('transform', function(d, i) { return 'translate(' + (marginLeft + i * barWidth) + ','+ -marginTop+')'; });

        bar.append('svg:rect')
          .attr('class', function(d, i) {
            if(i === 11) { // last year index
              return 'last bar'
            } else {
              return 'bar'
            }
          })
          .attr('y', function(d) { return y_scale(d.value); })
          .attr('height', function(d) { return height - y_scale(d.value); })
          .attr('width', barWidth - 1)
          .on('mouseover', function(d) {
            d3.selectAll('.bar').style('opacity', '.5');
            d3.select(this).style('opacity', '1');

            $amount.html('<span>'+formatNumber(parseInt(d.value, 10))+'</span>');
            $date.html('Hectares in ' + d.year);
          });
      });
    } else if (type === 'comp') {
      var sql = "SELECT iso, sum(umd.loss_gt_0) loss, max(umd.gain) gain FROM umd WHERE iso='"+options.iso+"' GROUP BY iso";

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
        if(json) {
          $graph.removeClass('ghost');

          var data = json.rows[0];
        } else {
          $coming_soon.show();

          return;
        }

        var data_ = [{
                      'key': 'Tree cover gain',
                      'value': data.gain
                    }, {
                      'key': 'Tree cover loss',
                      'value': data.loss
                    }];

        $amount.html('<span>'+formatNumber(parseInt(data_[data_.length - 1].value, 10))+'</span>');
        $date.html('Ha '+data_[data_.length - 1].key);

        var barWidth = (width - 80) / 12;

        var marginLeft = 40 + barWidth*5,
            marginTop = radius - h/2 + 5;

        var y_scale = d3.scale.linear()
          .domain([0, d3.max(data_, function(d) { return parseFloat(d.value); })])
          .range([height, marginTop*2]);

        var bar = graph.selectAll('g')
          .data(data_)
          .enter()
          .append('g')
          .attr('transform', function(d, i) { return 'translate(' + (marginLeft + i * barWidth) + ',' + -marginTop + ')'; });

        bar.append('svg:rect')
          .attr('class', function(d, i) {
            if (i === 1) { // last bar index
              return 'last bar'
            } else {
              return 'bar'
            }
          })
          .attr('y', function(d) { return y_scale(d.value); })
          .attr('height', function(d) { return height - y_scale(d.value); })
          .attr('width', barWidth - 1)
          .style('fill', '#FFC926')
          .style('shape-rendering', 'crispEdges')
          .on('mouseover', function(d) {
            d3.selectAll('.bar').style('opacity', '.5');
            d3.select(this).style('opacity', '1');

            $amount.html('<span>'+formatNumber(parseFloat(d.value).toFixed(1))+'</span>');
            $date.html('Ha '+d.key);
          });
      });
    }
  }
});
