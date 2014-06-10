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

    if (dataset === 'countries_gain') {
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
        if (json && json.rows.length > 0) {
          $graph.removeClass('ghost');
          $action.removeClass('disabled');
          that._initFormaDropdown();

          var data = json.rows.slice(1, json.rows.length);
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
            form_date = 'Alerts in ' + config.MONTHNAMES[date.getUTCMonth()] + ' ' + date.getUTCFullYear();

        $date.html(form_date);

        var cx = width - 80 + marginLeft;
        var cy = h - y_scale(data[data.length - 1].alerts) + marginTop;

        graph.append('svg:path')
          .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
          .attr('d', line(data))
          .on('mousemove', function(d) {
            var index = Math.round(x_scale.invert(d3.mouse(this)[0]));

            if (data[index]) { // if there's data
              $amount.html('<span>'+formatNumber(data[index].alerts)+'</span>');

              var date = new Date(data[index].date),
                  form_date = 'Alerts in ' + config.MONTHNAMES[date.getUTCMonth()] + ' ' + date.getUTCFullYear();

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
          .attr('cx', cx)
          .attr('cy', cy)
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
        if (json) {
          $graph.removeClass('ghost');

          var data = json.rows[0];
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
            if (i === 11) { // last year index
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
      var sql = "SELECT iso, sum(umd.loss_gt_0) loss, max(umd.gain) gain FROM umd WHERE iso='"+options.iso+"'";

      d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
        if (json) {
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