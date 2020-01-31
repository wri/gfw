/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends LayerClass).
 */
define([
  'underscore',
  'mps',
  'uri',
  'd3',
  'abstract/layer/OverlayLayerClass',
  'text!map/cartocss/style.cartocss',
  'text!map/templates/infowindow.handlebars'
], function(_, mps, UriTemplate, d3, OverlayLayerClass, CARTOCSS, TPL) {

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
      analysis: false,
      actions: {}
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

      cartodb.createLayer(this.map, cartodbOptions, { https: true })
        .on('done',
          _.bind(function(layer) {
            this.cdbLayer = layer;
            deferred.resolve(this.cdbLayer);
            mps.publish('Map/loading', [false]);
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
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     */
    getQuery: function() {
      return new UriTemplate(this.options.sql || this.queryTemplate)
        .fillFromObject({tableName: this.layer.table_name, analysis: this.options.analysis});
    },







    /**
     * Create a CartodDB infowindow object
     * and add to CartoDB layer
     *
     * @return {object}
     */
    setInfowindow: function() {
      var interactivity = this.options.actions ? this.options.interactivity : this.options.interactivity + ', ' + this.options.actions;
      this.infowindow = cdb.vis.Vis.addInfowindow(this.map, this.cdbLayer.getSubLayer(0), interactivity, {
        infowindowTemplate: TPL,
        templateType: 'handlebars',
      });

      this.listenersInfowindow();
      mps.publish('Analysis/shape-enableds');
    },

    listenersInfowindow: function() {
      this.infowindow.model.on('change', this.changeInfowindow.bind(this));

      mps.subscribe('Analysis/start-drawing', function(){
        this.infowindow.model.set('hidden', true);
      }.bind(this));

      mps.subscribe('Analysis/stop-drawing', function(){
        this.infowindow.model.set('hidden', false);
      }.bind(this));

      mps.subscribe('Analysis/enabled', function(enabled){
        this.infowindow.model.set('enabled', enabled)
      }.bind(this));

      mps.subscribe('Analysis/enabled-subscription', function(enabledSubscription){
        this.infowindow.model.set('enabledSubscription', enabledSubscription)
      }.bind(this));

      this.infowindowsUIEvents();
      this.infowindowsUIState();
    },

    changeInfowindow: function(model) {
      if (!!model.attributes.content) {
        var slope_semester = !!model.attributes.content.data.slope_semester;
        var alerts_last_semester = !!model.attributes.content.data.alerts_last_semester;

        if (!!slope_semester && !!alerts_last_semester) {
          this.drawSlopeGraph(slope_semester,alerts_last_semester);
        }
        if (!!slope_semester) {
          this.prettySlopeSemester(slope_semester);
        }

        // Set the ui events for the infowindow
        this.infowindowsUIEvents();
        this.infowindowsUIState();

      }
    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.remove();
      }
    },

    infowindowsUIEvents: function() {
      var $map = $('#map');
      var self = this;
      $map.find('.cartodb-popup').on('click.infowindow', '.analyze-shape', function (e) {
        if ($(e.target).attr('data-zoom') === 'true') {

          mps.publish('Zoom/in', [$(this).data('bbox')]);

        } else {
          var isDisabled = $(e.currentTarget).hasClass('disabled');

          if (!isDisabled) {
            $('#map').find('.cartodb-infowindow').hide(0);

            var shapeData = {
              useid: $(this).data('useid'),
              use: $(this).data('use'),
              wdpaid: $(this).data('wdpaid')
            };

            mps.publish('Analysis/shape', [shapeData]);

            // Analytics events
            (shapeData.wdpaid) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze Protected Area' + shapeData.wdpaid) : null;
            (shapeData.useid) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze ' + shapeData.use.toUpperCase() + ' ' + shapeData.useid) : null;
          } else {
            mps.publish('Notification/open', ['notification-select-forest-change-layer']);
          }
        }
      });

      $map.find('.cartodb-popup').on('click.infowindow', '.subscribe-shape', function (e) {
        $('#map').find('.cartodb-infowindow').hide(0);

        var shapeData = {
          useid: $(this).data('useid'),
          use: $(this).data('use'),
          wdpaid: $(this).data('wdpaid')
        };

        mps.publish('Subscribe/shape', [shapeData]);

        // Analytics events
        if (self.clickTimer) {
          clearTimeout(self.clickTimer);
          self.clickTimer = null;
        }
        self.clickTimer = setTimeout(function() {
          (shapeData.wdpaid) ? ga('send', 'event', 'Subscribe', 'Click infowindow to subscribe', 'Protected Area ' + shapeData.wdpaid) : null;
          (shapeData.useid) ? ga('send', 'event', 'Subscribe', 'Click infowindow to subscribe', 'Use ' + shapeData.use.toUpperCase() + ' ' + shapeData.useid) : null;
        }, 100);
      });
    },

    infowindowsUIState: function() {
      var model = this.infowindow.model;
      $('#map').find('.cartodb-popup .analyze-shape').toggleClass('disabled', !model.get('enabled'))

      $('#map').find('.cartodb-infowindow').toggleClass('-hidden', !!model.get('hidden'));
      if (!!model.get('hidden')) {
        $('#map').find('.cartodb-infowindow').hide(0);
      }
    },

    setHighlight: function(layer) {
      var subLayer = this.cdbLayer.getSubLayer(0);
      subLayer.setInteraction(true);
      this.cdbLayer.on('featureClick', function(e, pos, latlng, data) {
        var data = _.extend({}, data,{
          useid: data.cartodb_id,
          use: data.tablename,
          wdpaid: data.id
        });
        mps.publish('Shape/update', [data]);
      }.bind(this));
    },


    /**
     * Slope graph
     * @param slope
     * @param alerts
     */
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
