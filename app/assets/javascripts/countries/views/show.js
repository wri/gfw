gfw.ui.view.CountriesShow = cdb.core.View.extend({
  el: $('.country-show'),

  events: {
    'click .info': '_openSource',
    'change #areaSelector': '_onSelectArea'
  },

  initialize: function() {
    var self = this;
    _.bindAll(this, '_positionScroll');

    this.iso = this.options.iso;
    this.$nav = this.$('.country-nav');
    this.$indepth = this.$('.country-indepth');
    this.$areaSelector = this.$('#areaSelector');

    this.country = new gfw.ui.model.Country({ iso: this.iso });

    this._setAreaSelector();
    this._stickynav();
    this._initViews();

    var sql = new cartodb.SQL({ user: 'wri-01' });
    sql.execute("SELECT bounds FROM country_mask WHERE code = '" + this.country.get('iso')  + "'")
      .done(function(data) {
        var bounds = JSON.parse(data.rows[0].bounds),
            geojson = L.geoJson(bounds);
        
        //self.map.fitBounds(geojson.getBounds());
        self._initMap(geojson.getBounds());
      });
  },

  _initViews: function() {
    this._initSource();
    this._drawTenure();
    this._drawForestsType();
    this._drawFormaAlerts();
  },

  _initSource: function() {
    this.sourceWindow  = new gfw.ui.view.SourceWindow();
    this.$el.append(this.sourceWindow.render());
  },

  _openSource: function(e) {
    e.preventDefault();

    var source = $(e.target).closest('.info').attr('data-source');

    ga('send', 'event', 'SourceWindow', 'Open', source);
    this.sourceWindow.show(source).addScroll();
  },

  _setAreaSelector: function() {
    var self = this;

    this.country.fetch({
      success: function(model, response, options) {
        _.each(model.get('areas').models, function(area) {
          self.$areaSelector.append('<option value="' + area.get('name_1') + '">' + area.get('name_1') + '</option>')
        });
      },
      error: function() {}
    });
  },

  _onSelectArea: function() {
    var areaName = this.$areaSelector.val();
    var area = this.country.get('areas').where({ name_1: areaName })[0];
    this._highlightArea(area);
  },

  _initMap: function(bounds) {
    var self = this;

    this.map = new L.Map('countryMap', {
      center: [0, 0],
      maxBounds: bounds,
      zoom: 3,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      attributionControl: false
    });

    this.map.fitBounds(bounds);

    // set forest cover layer
    var tileLayer = L.tileLayer('http://earthengine.google.org/static/hansen_2013/tree_alpha/{z}/{x}/{y}.png', {
      opacity: 0
    }).addTo(this.map);

    // set country layer
    cartodb.createLayer(this.map, {
      user_name: 'wri-01',
      type: 'cartodb',
      cartodb_logo: false,
      sublayers: [{
        sql: "SELECT * FROM country_mask",
        cartocss: "\
          #country_mask {\
            polygon-fill: #2D2B36;\
            polygon-opacity: 1;\
            line-color: #2D2B36;\
            line-width: 1;\
            line-opacity: 1;\
          }\
          #country_mask[code='" + this.country.get('iso') + "'] {\
            polygon-fill: #FF6600;\
            polygon-opacity: 0;\
            line-color: #73707D;\
            line-width: 1;\
            line-opacity: 1;\
          }"
      }]
    })
    .addTo(this.map)
    .done(function(layer) {
      setTimeout(function() {
        tileLayer.setOpacity(1)
      }, 600);
    });
  },

  _highlightArea: function(area) {
  },

  _positionScroll: function() {
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
          if ($('.country-tenure').not(':visible')) {
            $('.country-tenure').show();
          }

          h += 50;

          tenures_ord.push({
            name: tenure['name'],
            percent: tenure['percent']
          });
        }
      });

      var svg = d3.select('.country-tenure .line-graph')
        .append('svg')
        .attr('width', 600)
        .attr('height', h);

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
          return x_scale(d['percent']);
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
          return x_scale(d['percent']);
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
          return x_scale(d['percent'])+10;
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

    d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {
      // TODO => if percents are 0
      var data = _.pluck(json.rows, 'percent');

      var width = 225,
          height = 225,
          radius = Math.min(width, height) / 2,
          colors = ['#819515', '#A1BA42', '#DDDDDD'],
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
        .text(function(d) { return d.data + '%' })
        .attr('fill', function(d, i) { return labelColors[i]; } )
        .style('font-size', '13px');
    });
  },

  _drawFormaAlerts: function() {
    var that = this;

    var $graph = $('.forma-graph');

    var width     = 500,
        height    = 156,
        h         = 156, // maxHeight
        radius    = width / 2,
        gridLinesCount = 7;

    // Add dashed grid
    var graph = d3.select('.forma-graph')
      .append('svg:svg')
      .attr('class', 'line')
      .attr('width', width)
      .attr('height', height);

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
      } else {
        console.log('no data');
        //$coming_soon.show();
        return;
      };

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

        //$amount.html('<span>'+formatNumber(data[data.length - 1].alerts)+'</span>');

        var date = new Date(data[data.length - 1].date),
            form_date = 'Alerts in ' + config.MONTHNAMES[date.getUTCMonth()] + ' ' + date.getUTCFullYear();

        //$date.html(form_date);

        var cx = width - 80 + marginLeft;
        var cy = h - y_scale(data[data.length - 1].alerts) + marginTop;

        graph.append('svg:path')
          .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')')
          .attr('d', line(data))
          .on('mousemove', function(d) {
            var index = Math.round(x_scale.invert(d3.mouse(this)[0]));

            if (data[index]) { // if there's data
              //$amount.html('<span>'+formatNumber(data[index].alerts)+'</span>');

              var date = new Date(data[index].date),
                  form_date = 'Alerts in ' + config.MONTHNAMES[date.getUTCMonth()] + ' ' + date.getUTCFullYear();

              //$date.html(form_date);

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
  }

});
