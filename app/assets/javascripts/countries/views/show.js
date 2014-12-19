gfw.ui.view.CountriesShow = cdb.core.View.extend({
  el: $('.country-show'),

  events: {
    'click .info': '_openSource',
    'click .forma_dropdown-link': '_openDropdown',
  },

  initialize: function() {
    var self = this;
    _.bindAll(this, '_positionScroll');

    // Cache
    this.$nav = this.$('.country-nav');
    this.$indepth = this.$('.country-indepth');

    // Models
    this.country = new gfw.ui.model.Country({ iso: this.options.iso });

    // Initialize modules
    this.headerView = new gfw.ui.view.CountryHeader({country: this.country});
    this._stickynav();
    this._initSource();
    this._drawTenure();
    this._drawForestsType();
    this._drawFormaAlerts();
    this._initFormaDropdown();
    this._initShare();
  },

  _initShare: function() {
    Share       = new gfw.ui.view.Share({template: 'country'});
    Share_entry = new gfw.ui.view.Share({template: 'country-entry'});
    this.$el.find('.country-sidenav .share-container').append(Share.render());
    this.$el.find('.section-info').slice(0,5).addClass('and_share').append(Share_entry.render());
  },

  _initSource: function() {
    this.sourceWindow  = new gfw.ui.view.SourceWindow();
    this.$el.append(this.sourceWindow.render());
  },

  _openSource: function(e) {
    e && e.preventDefault();

    var source = $(e.target).closest('.info').attr('data-source');

    // ga('send', 'event', 'SourceWindow', 'Open', source);
    this.sourceWindow.show(source).addScroll();
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

  _positionScroll: function() {
    if ($('.country-alerts').length < 1 || $('.country-conventions').length < 1 ) return;

    var h_min = $('.country-alerts').offset().top - 48,
        h_max = $('.country-conventions').offset().top - 46;

    if ($(window).scrollTop() > (h_min) && $(window).scrollTop() < h_max) {
      // fixed
      this.$nav.css({
        position: 'fixed',
        top: 0
      });
      this.$nav.addClass('fixed');
    } else if ($(window).scrollTop() >= h_max) {
      // dissapear
      this.$nav.css({
        position: 'absolute',
        top: h_max - h_min
      });
    } else {
      // default
      this.$nav.css({
        position: 'absolute',
        top: 0
      });
      this.$nav.removeClass('fixed');
    }
  },

  _stickynav: function() {
    this._positionScroll();

    $.scrollIt({
      upKey: null,
      downKey: null,
      easing: 'linear',
      scrollTime: 400,
      activeClass: 'active',
      onPageChange: null,
      topOffset: - 48
    });

    $(window).scroll(this._positionScroll);
  },

  _drawTenure: function() {
    var sql = ['SELECT tenure_government, tenure_owned, tenure_owned_individuals,',
               'tenure_reserved, GREATEST(tenure_government, tenure_owned,',
                                        'tenure_owned_individuals,',
                                        'tenure_owned_individuals,',
                                        'tenure_reserved) as max',
               "FROM gfw2_countries WHERE iso = '" + this.country.get('iso') + "'"].join(' ');

    d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+ sql, function(json) {
      var data = json.rows[0],
          h = 0;

      var x_extent = [0, data.max],
          x_scale = d3.scale.linear()
                      .range([0, 500])
                      .domain(x_extent);

      var origins = [],
          aggr = 0,
          klass = ['one', 'two', 'three', 'four']

      var tenures = [
        {
          name: 'Public lands administered by the government',
          percent: data.tenure_government
        },
        {
          name: 'Public lands reserved for communities and indigenous groups',
          percent: data.tenure_reserved
        },
        {
          name: 'Private lands owned by communities and indigenous groups',
          percent: data.tenure_owned
        },
        {
          name: 'Private lands owned by firms and individuals',
          percent: data.tenure_owned_individuals
        }
      ];

      var tenures_ord = [];

      _.each(tenures, function(tenure, i) {
        if (tenure['percent'] !== null && tenure['percent'] !== 0) {
          h += 50;

          tenures_ord.push({
            name: tenure['name'],
            percent: tenure['percent']
          });
        }
      });

      if (tenures_ord.length === 0) {
        $('.country-tenure .coming-soon').show();
        return;
      }

      var svg = d3.select('.country-tenure .line-graph')
        .append('svg')
        .attr('height', h);

      var svgWidth = $(svg[0]).outerWidth();
      var svgMaxWidth = svgWidth - 80;

      // add lines
      svg.selectAll('rect')
        .data(tenures_ord)
        .enter()
        .append('rect')
        .attr('class', function(d, i) {
          return klass[i];
        })
        .attr('x', function() {
          return x_scale(0);
        })
        .attr('y', function(d, i) {
          return 25 + (50 * i);
        })
        .attr('width', function(d) {
          var width = x_scale(d['percent']);
          return width > svgMaxWidth ? svgMaxWidth : width;
        })
        .attr('height', 4)
        .attr('rx', 2)
        .attr('ry', 2);

      // add balls
      svg.selectAll('circle')
        .data(tenures_ord)
        .enter()
        .append('svg:circle')
        .attr('class', function(d, i) {
          return klass[i];
        })
        .attr('cx', function(d, i) {
          var x = x_scale(d['percent']);
          return x > svgMaxWidth ? svgMaxWidth : x;
        })
        .attr('cy', function(d, i) {
          return 27 + (50 * i);
        })
        .attr('r', 5);

      // add values
      svg.selectAll('.units')
        .data(tenures_ord)
        .enter()
        .append('text')
        .text(function(d) {
          return d['percent']/1000000 + 'Mha';
        })
        .attr('class', function(d, i) {
          return 'units ' + klass[i];
        })
        .attr('x', function(d, i) {
          var x = x_scale(d['percent'])+10;
          return x > (svgMaxWidth + 10) ? (svgMaxWidth + 10) : x;
        })
        .attr('y', function(d, i) {
          return 31 + (50 * i);
        });

      // add legend
      svg.selectAll('.legend')
        .data(tenures_ord)
        .enter()
        .append('text')
        .text(function(d) {
          return d['name'];
        })
        .attr('class', function(d, i) {
          return 'legend ' + klass[i];
        })
        .attr('x', 0)
        .attr('y', function(d, i) {
          return 15 + (50 * i);
        });
    });
  },

  _drawForestsType: function() {
    var sql = ["SELECT unnest(array['forest_regenerated', 'forest_primary', 'forest_planted'])",
               'AS type, unnest(array[COALESCE(forest_regenerated, 0),',
                                     'COALESCE(forest_primary, 0),',
                                     'COALESCE(forest_planted, 0)])',
               'AS percent',
               'FROM gfw2_countries',
               "WHERE iso = '" + this.country.get('iso') + "'"].join(' ');

    d3.json('https://wri-01.cartodb.com/api/v2/sql?q=' + sql, function(json) {
      var data = _.pluck(json.rows, 'percent'),
          sumData = _.reduce(data, function(memo, num){ return memo + num; }, 0),
          $countryForestType = $('.country-forests-type');

      if (sumData === 0) {
        $countryForestType.find('.coming-soon').show();
        return;
      }

      if (sumData !== 100) {
        data[2] = (100 - (data[0] + data[1]));
      }

      $countryForestType.find('.forest-type-legends').show();

      var width = 225,
          height = 225,
          radius = Math.min(width, height) / 2,
          colors = ['#A1BA42', '#819515', '#DDDDDD'],
          labelColors = ['white', 'white', '#555'];

      var pie = d3.layout.pie()
          .sort(null);

      var arc = d3.svg.arc() // create <path> elements for using arc data
          .innerRadius(radius - 67)
          .outerRadius(radius)

      var svg = d3.select(".forests-type-graph")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var path = svg.selectAll("path")
          .data(pie(data));

      path.enter().append("path")
        .attr("fill", function(d, i) { return colors[i]; })
        .attr("d", arc);

      path.enter().append('text')
        .attr('transform', function(d) { var c = arc.centroid(d); return 'translate(' + (c[0]-12) + ',' + (c[1]+8) + ')'})
        .text(function(d) {
          if (d.data > 0) return d.data + '%'
        })
        .attr('fill', function(d, i) { return labelColors[i]; } )
        .style('font-size', '13px');
    });
  },

  _drawFormaAlerts: function() {
    var that = this;

    var $graph = this.$('.forma-graph'),
        $tooltip = this.$('.graph-tooltip')
        $amount = $tooltip.find('.graph-amount'),
        $date = $tooltip.find('.graph-date'),
        $comingSoonContent = this.$('#comingSoonContent'),
        $formaAlertsContent = this.$('#formaAlertsContent'),
        $formaAlertsTitle = this.$('#formaAlertsTitle');

    // Dimensions variables
    var width     = 500,
        height    = 156,
        h         = 136, // maxHeight
        radius    = width / 2,
        gridLinesCount = 7;

    // Init graph
    var graph = d3.select('.forma-graph')
      .append('svg:svg')
      .attr('class', 'line')
      .attr('width', width)
      .attr('height', height);

    // Add dashed lines grid
    var gridLineY = height;
    for (var i = 0; i < gridLinesCount; i++) {
      graph.append('svg:line')
        .attr('x1', 0)
        .attr('y1', gridLineY)
        .attr('x2', width)
        .attr('y2', gridLineY)
        .style('stroke-dasharray', ('2, 3'))
        .style('stroke', function() { return (i == 0) ? '#333' : '#CCC'; } );

      gridLineY -= height/(gridLinesCount-1);
    };

    // Render forma graph
    var sql = ["SELECT date_trunc('month', date) as date, COUNT(*) as alerts",
               'FROM forma_api',
               "WHERE iso = '" + this.country.get('iso') + "'",
               "GROUP BY date_trunc('month', date)",
               "ORDER BY date_trunc('month', date) ASC"].join(' ');

    d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {
      if (json && json.rows.length > 0) {
        var data = json.rows.slice(1, json.rows.length);
        if (data.length == 0) data = json.rows;
        var lastMonth = data[data.length - 1];
        $formaAlertsTitle.find('.amount').text(formatNumber(lastMonth.alerts));
        $formaAlertsTitle.find('.month').text(config.MONTHNAMES[new Date(lastMonth.date).getUTCMonth()])

        $formaAlertsContent.show();
      } else {
        $comingSoonContent.show();
        return;
      };

      var x_scale = d3.scale.linear()
        .domain([0, data.length - 1])
        .range([0, width - 40]);

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
        .interpolate("monotone");

      var marginTop = 20,
          marginLeft = 20;

      var cx = width - 40 + marginLeft;
      var cy = h - y_scale(data[data.length - 1].alerts) + marginTop;

      var tooltip = d3.select('.forma-graph')
        .append('div')
        .attr('class', 'graph-tooltip')
        .style('visibility', 'hidden')

      var amount = tooltip
        .append('div')
        .attr('class', 'graph-amount')
        .text('21,123')

      tooltip
        .append('div')
        .attr('class', 'graph-date')
        .text('Alerts in')

      var tooltipDate = tooltip.select('.graph-date')
        .append('div')
        .attr('class', 'date')
        .text('November 2012');

      graph.append('svg:path')
        .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
        .attr('d', line(data));

      var positioner = graph.append('svg:line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', height)
        .style('visibility', 'hidden')
        .style('stroke', '#aaa');

      var marker = graph.append('svg:circle')
        .attr('class', 'forma-marker')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 5);

      graph
        .on("mouseout", function() {
          positioner.style("visibility", "hidden");
          tooltip.style("visibility", "hidden");
        })
        .on("mouseover", function() {
          positioner.style("visibility", "visible");
          tooltip.style("visibility", "visible");
        })
        .on('mousemove', function(d) {
          var index = Math.round(x_scale.invert(d3.mouse(this)[0]));

          if (data[index]) {
            var cx = d3.mouse(this)[0] + marginLeft,
                cy = h - y_scale(data[index].alerts) + marginTop,
                date = new Date(data[index].date),
                formattedDate = config.MONTHNAMES[date.getUTCMonth()] + ' ' + date.getUTCFullYear();

            marker
              .attr('cx', cx)
              .attr('cy', cy);

            positioner
              .attr('x1', d3.mouse(this)[0] + marginLeft)
              .attr('x2', d3.mouse(this)[0] + marginLeft);

            amount.text(formatNumber(data[index].alerts));
            tooltipDate.text(formattedDate);
            tooltip.style("top", "-20px").style("left", (cx - 162) + "px");
          }

        });

    });
  },

  _openDropdown: function(e) {
    e.preventDefault();
  },

});
