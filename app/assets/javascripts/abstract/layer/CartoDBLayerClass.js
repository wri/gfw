/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends LayerClass).
 */
define([
  'underscore',
  'uri',
  'd3',
  'abstract/layer/OverlayLayerClass',
  'text!map/cartocss/style.cartocss',
  'text!map/templates/infowindow.handlebars'
], function(_, UriTemplate, d3, OverlayLayerClass, CARTOCSS, TPL) {

  'use strict';

  var CartoDBLayerClass = OverlayLayerClass.extend({

    defaults: {
      user_name: 'wri-01',
      type: 'cartodb',
      sql: null,
      cartocss: CARTOCSS,
      interactivity: 'cartodb_id, name',
      infowindow: false,
      cartodb_logo: false,
      raster: false,
      analysis: false
    },

    queryTemplate: 'SELECT cartodb_id||\':\' ||\'{tableName}\' as cartodb_id, the_geom_webmercator,' +
      '\'{tableName}\' AS layer, {analysis} AS analysis, name FROM {tableName}',

    _getLayer: function() {
      var deferred = new $.Deferred();

      var cartodbOptions = {
        name: this.name,
        type: this.options.type,
        cartodb_logo: this.options.cartodb_logo,
        user_name: this.options.user_name,
        sublayers: [{
          sql: this.getQuery(),
          cartocss: this.options.cartocss,
          interactivity: this.options.interactivity,
          raster: this.options.raster,
          raster_band: this.options.raster_band
        }]
      };

      cartodb.createLayer(this.map, cartodbOptions)
        .on('done',
          _.bind(function(layer) {
            this.cdbLayer = layer;
            deferred.resolve(this.cdbLayer);
          }, this)
        );

      return deferred.promise();
    },

    updateTiles: function() {
      if (this.cdbLayer) {
        this.cdbLayer.setQuery(this.getQuery());
      }
    },

    /**
     * Create a CartodDB infowindow object
     * and add to CartoDB layer
     *
     * @return {object}
     */
    setInfowindow: function() {
      this.infowindow = cdb.vis.Vis.addInfowindow(this.map, this.cdbLayer.getSubLayer(0), this.options.interactivity, {
        infowindowTemplate: TPL,
        templateType: 'handlebars',
      });
      this.infowindowsButtons();
      this.infowindow.model.on('change', _.bind(function(model) {
        if (!!model.attributes.content.data.slope_semester && !!model.attributes.content.data.alerts_last_semester) {
          this.drawSlopeGraph(model.attributes.content.data.slope_semester,model.attributes.content.data.alerts_last_semester);
        }
        if (!!model.attributes.content.data.slope_semester) {this.prettySlopeSemester(model.attributes.content.data.slope_semester)}
        var analysis = $('#analysis-tab-button').hasClass('disabled');
        $('#analyzeBtn').toggleClass('dont-analyze', analysis);
        mps.publish('Infowindow/toggleSubscribeButton', []);
      }, this));
      this.infowindow.model.on('change', _.bind(function(model) {
        this.infowindowsButtons();
      }, this));

    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.remove();
      }
    },

    infowindowsButtons: function(){
      $('.cartodb-popup').on('click', '.analyze-concession', function (e) {
        $('.cartodb-infowindow').hide(0);
        if (!$(e.currentTarget).hasClass('dont-analyze')) {
          mps.publish('AnalysisTool/analyze-concession', [$(this).data('useid'), $(this).data('use'), $(this).data('wdpaid')]);

          ($(this).data('wdpaid')) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze Protected Area' + $(this).data('wdpaid')) : null;
          ($(this).data('useid')) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze ' + $(this).data('use').toUpperCase() + ' ' + $(this).data('useid')) : null;
        }else{
          mps.publish('Notification/open', ['not-select-forest']);
        }

      });
      $('.cartodb-popup').on('click', '.subscription-concession', function (e) {
        if (!$(e.currentTarget).hasClass('disabled')) {
          $('.cartodb-infowindow').hide(0);
          mps.publish('Subscription/analyze-concession', [$(this).data('useid'), $(this).data('use'), $(this).data('wdpaid')]);

          ($(this).data('wdpaid')) ? ga('send', 'event', 'Map', 'Subscribe', 'Analyze Protected Area' + $(this).data('wdpaid')) : null;
          ($(this).data('useid')) ? ga('send', 'event', 'Map', 'Subscribe', 'Analyze ' + $(this).data('use').toUpperCase() + ' ' + $(this).data('useid')) : null;
        }
      });
    },


    /**
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     */
    getQuery: function() {
      return new UriTemplate(this.options.sql || this.queryTemplate)
        .fillFromObject({tableName: this.layer.table_name, analysis: this.options.analysis});
    },

    drawSlopeGraph: function(slope, alerts) {
      alerts = JSON.parse(alerts);
      d3.select("#graphSlope").select("svg").remove();
      var margin = {top: 15, right: 40, bottom: 15, left:40},
          width = 200,
          height = 100;

      var x = d3.time.scale()
          .domain([new Date(alerts[0].date), d3.time.day.offset(new Date(alerts[alerts.length - 1].date), 1)])
          .rangeRound([0, width - margin.left - margin.right]);

      var y = d3.scale.linear()
          .domain([0, d3.max(alerts, function(d) { return d.count; })])
          .range([height - margin.top - margin.bottom, 0]);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .tickFormat(d3.format("s"))
          .outerTickSize(0)
          .ticks(5)
          .tickPadding(10)
          .tickPadding(1);

      var svg = d3.select('#graphSlope').append('svg')
          .attr('class', 'chart')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      svg.selectAll('.chart')
          .data(alerts)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function(d) { return x(new Date(d.date)); })
          .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.count)) })
          .attr('width', 6)
          .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.count) });

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    },

    prettySlopeSemester: function(total) {
      if (total < 0)
        var triangle = '<span style="color:lightgreen">▼</span>';
      else if (total > 0)
        var triangle = '<span style="color:red">▲</span>';
      else
        return 1;
      $('#slopeTotal').html(total + triangle);
    }

  });

  return CartoDBLayerClass;
});
